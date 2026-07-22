const db = require('../../config/database');


const findAll = async () => {

    const [rows] = await db.query(
        `
        SELECT
            a.*,
            m.nom_complet AS createur
        FROM activities a

        LEFT JOIN membres m
            ON m.id = a.created_by

        WHERE a.deleted_at IS NULL

        ORDER BY a.date_debut DESC
        `
    );

    return rows;
};


const findById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            a.*,
            m.nom_complet AS createur
        FROM activities a

        LEFT JOIN membres m
            ON m.id = a.created_by

        WHERE a.id = ?
        AND a.deleted_at IS NULL

        LIMIT 1
        `,
        [id]
    );

    return rows[0];
};


const create = async (data) => {

    const [result] = await db.query(
        `
        INSERT INTO activities
        (
            titre,
            description,
            image,
            image_public_id,
            date_debut,
            date_fin,
            lieu,
            type_activite,
            montant,
            statut,
            created_by
        )

        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            data.titre,
            data.description,
            data.image,
            data.image_public_id,
            data.date_debut,
            data.date_fin,
            data.lieu,
            data.type_activite,
            data.montant,
            data.statut,
            data.created_by
        ]
    );


    return result.insertId;

};


const update = async (
    id,
    data
) => {

    await db.query(
        `
        UPDATE activities

        SET
            titre = ?,
            description = ?,
            image = ?,
            image_public_id = ?,
            date_debut = ?,
            date_fin = ?,
            lieu = ?,
            type_activite = ?,
            montant = ?,
            statut = ?

        WHERE id = ?
        `,
        [
            data.titre,
            data.description,
            data.image,
            data.image_public_id,
            data.date_debut,
            data.date_fin,
            data.lieu,
            data.type_activite,
            data.montant,
            data.statut,
            id
        ]
    );


    return true;

};


const remove = async (id) => {

    await db.query(
        `
        UPDATE activities

        SET deleted_at = NOW()

        WHERE id = ?
        `,
        [id]
    );


    return true;

};


const getNext = async (
    membreId
) => {


    const [rows] = await db.query(
        `
        SELECT

            a.id,
            a.titre,
            a.description,
            a.image,
            a.date_debut,
            a.date_fin,
            a.lieu,
            a.type_activite,
            a.montant,
            p.statut AS statut_participation,
            (
                SELECT COUNT(*)
                FROM participations_activities pa
                WHERE pa.activitie_id = a.id
                AND pa.statut IN (
                    'en_attente',
                    'valide',
                    'present'
                )
            ) AS participants,

            CASE
                WHEN p.id IS NOT NULL
                THEN 1
                ELSE 0
            END AS inscrit


        FROM activities a


        LEFT JOIN participations_activities p
       

            ON p.activitie_id = a.id
          

            AND p.membre_id = ?

            AND p.statut IN (
                'en_attente',
                'valide',
                'present'
            )


        WHERE
            a.date_debut >= NOW()


        ORDER BY
            a.date_debut DESC


        LIMIT 1

        `,
        [
            membreId
        ]
    );


    return rows[0];

};

const findPublic = async () => {

    const [rows] = await db.query(
        `
        SELECT

            id,
            titre,
            description,
            image,
            date_debut,
            date_fin,
            lieu,
            type_activite,
            montant

        FROM activities

        WHERE

            deleted_at IS NULL

            AND is_public = 1

        ORDER BY
            CASE
                WHEN date_debut >= NOW() THEN 0
                ELSE 1
            END,
            date_debut ASC

        LIMIT 6

        `
    );

    return rows;

};

module.exports = {

    findAll,
    findById,
    create,
    update,
    remove,
    getNext,
    findPublic

};