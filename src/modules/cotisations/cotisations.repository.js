const db = require('../../config/database');



/**
 * Liste des cotisations
 */
const findAll = async()=>{


    const [rows] = await db.query(
        `
        SELECT

            c.id,
            c.titre,
            c.description,
            c.montant,
            c.date_debut,
            c.date_fin,
            c.date_limite,
            c.statut,
            c.created_at,


            tc.id AS type_id,
            tc.nom AS type_nom,
            tc.periodicite,


            m.id AS createur_id,
            m.nom_complet AS createur_nom


        FROM cotisations c


        INNER JOIN types_cotisations tc

            ON tc.id = c.type_cotisation_id


        INNER JOIN membres m

            ON m.id = c.created_by



        ORDER BY c.created_at DESC

        `
    );


    return rows;

};







/**
 * Liste cotisations ouvertes
 */
const findAvailable = async()=>{


    const [rows] = await db.query(
        `
        SELECT

            c.id,
            c.titre,
            c.description,
            c.montant,
            c.date_debut,
            c.date_fin,
            c.date_limite,
            c.statut,


            tc.nom AS type_nom,
            tc.periodicite


        FROM cotisations c


        INNER JOIN types_cotisations tc

            ON tc.id = c.type_cotisation_id


        WHERE c.statut = 'ouverte'


        ORDER BY c.date_debut DESC

        `
    );


    return rows;

};








/**
 * Trouver par ID
 */
const findById = async(id)=>{


    const [rows] = await db.query(
        `
        SELECT

            c.*,

            tc.nom AS type_nom,
            tc.periodicite


        FROM cotisations c


        INNER JOIN types_cotisations tc

            ON tc.id = c.type_cotisation_id


        WHERE c.id = ?


        LIMIT 1

        `,
        [
            id
        ]
    );


    return rows[0];

};









/**
 * Création
 */
const create = async(data)=>{


    const [result] = await db.query(
        `
        INSERT INTO cotisations
        (

            type_cotisation_id,

            titre,

            description,

            montant,

            date_debut,

            date_fin,

            date_limite,

            statut,

            created_by

        )


        VALUES
        (?,?,?,?,?,?,?,?,?)

        `,
        [

            data.type_cotisation_id,

            data.titre,

            data.description,

            data.montant,

            data.date_debut,

            data.date_fin,

            data.date_limite,

            data.statut,

            data.created_by

        ]
    );


    return result.insertId;

};









/**
 * Modification
 */
const update = async(id,data)=>{


    await db.query(
        `
        UPDATE cotisations

        SET

            titre = ?,

            description = ?,

            montant = ?,

            date_debut = ?,

            date_fin = ?,

            date_limite = ?,

            statut = ?



        WHERE id = ?

        `,
        [

            data.titre,

            data.description,

            data.montant,

            data.date_debut,

            data.date_fin,

            data.date_limite,

            data.statut,

            id

        ]
    );


};









/**
 * Suppression
 */
const remove = async(id)=>{


    await db.query(
        `
        UPDATE cotisations

        SET statut = 'archivee'


        WHERE id = ?

        `,
        [
            id
        ]
    );


};








module.exports = {


    findAll,

    findAvailable,

    findById,

    create,

    update,

    remove


};