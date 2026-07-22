const db = require('../../config/database');



/**
 * Liste paginée des publications
 */
const findAll = async (
    limit,
    offset,
    membre_id
) => {


    const [rows] = await db.query(
        `
        SELECT

            p.id,
            p.contenu,
            p.image,
            p.created_at,


            m.id AS auteur_id,
            m.nom_complet AS auteur_nom,
            m.photo_identite AS auteur_photo,


            COUNT(DISTINCT l.id) AS likes,


            CASE
                WHEN ul.id IS NOT NULL
                THEN true
                ELSE false
            END AS liked,


            COUNT(DISTINCT c.id) AS commentsCount



        FROM publications p



        INNER JOIN membres m

            ON m.id = p.created_by




        LEFT JOIN likes l

            ON l.publication_id = p.id




        LEFT JOIN likes ul

            ON ul.publication_id = p.id
            AND ul.membre_id = ?




        LEFT JOIN commentaires c

            ON c.publication_id = p.id




        GROUP BY
            p.id



        ORDER BY

            p.created_at DESC



        LIMIT ? OFFSET ?


        `,
        [
            membre_id,
            limit,
            offset
        ]
    );


    return rows;

};








/**
 * Compter total publications
 */
const count = async()=>{


    const [
        rows
    ] = await db.query(
        `
        SELECT COUNT(*) AS total

        FROM publications
        `
    );


    return rows[0].total;

};








/**
 * Trouver par ID
 */
const findById = async(
    id,
    membre_id
)=>{


    const [
        rows
    ] = await db.query(
        `
        SELECT


            p.id,
            p.contenu,
            p.image,
            p.created_at,



            m.id AS auteur_id,
            m.nom_complet AS auteur_nom,
            m.photo_identite AS auteur_photo,



            COUNT(DISTINCT l.id) AS likes,



            CASE
                WHEN ul.id IS NOT NULL
                THEN true
                ELSE false
            END AS liked,



            COUNT(DISTINCT c.id) AS commentsCount




        FROM publications p



        INNER JOIN membres m

            ON m.id = p.created_by




        LEFT JOIN likes l

            ON l.publication_id = p.id




        LEFT JOIN likes ul

            ON ul.publication_id = p.id
            AND ul.membre_id = ?




        LEFT JOIN commentaires c

            ON c.publication_id = p.id




        WHERE p.id = ?



        GROUP BY
            p.id



        LIMIT 1


        `,
        [
            membre_id,
            id
        ]
    );


    return rows[0];

};









/**
 * Création publication
 */
const create = async(data)=>{


    const [
        result
    ] = await db.query(
        `
        INSERT INTO publications
        (
            contenu,
            image,
            image_public_id,
            created_by
        )

        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )

        `,
        [
            data.contenu,
            data.image,
            data.image_public_id,
            data.created_by
        ]
    );


    return result.insertId;

};








/**
 * Modification
 */
const update = async(
    id,
    data
)=>{


    await db.query(
        `
        UPDATE publications

        SET

            contenu = ?,
            image = ?,
            image_public_id = ?


        WHERE id = ?

        `,
        [
            data.contenu,
            data.image,
            data.image_public_id,
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
        DELETE FROM publications

        WHERE id = ?

        `,
        [
            id
        ]
    );


};







module.exports = {

    findAll,

    count,

    findById,

    create,

    update,

    remove

};