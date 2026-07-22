const db = require('../../config/database');



/**
 * Liste des commentaires d'une publication
 */
const findByPublication = async (
    publication_id
) => {


    const [
        rows
    ] = await db.query(
        `
        SELECT

            c.id,
            c.contenu,
            c.created_at,


            m.id AS auteur_id,
            m.nom_complet AS auteur_nom,
            m.photo_identite AS auteur_photo


        FROM commentaires c


        INNER JOIN membres m

            ON m.id = c.membre_id



        WHERE c.publication_id = ?



        ORDER BY
            c.created_at ASC


        `,
        [
            publication_id
        ]
    );


    return rows;

};






/**
 * Trouver un commentaire par ID
 */
const findById = async (
    id
) => {


    const [
        rows
    ] = await db.query(
        `
        SELECT

            c.id,
            c.contenu,
            c.publication_id,
            c.membre_id,
            c.created_at,


            m.id AS auteur_id,
            m.nom_complet AS auteur_nom,
            m.photo_identite AS auteur_photo


        FROM commentaires c


        INNER JOIN membres m

            ON m.id = c.membre_id


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
 * Créer un commentaire
 */
const create = async (
    data
) => {


    const [
        result
    ] = await db.query(
        `
        INSERT INTO commentaires
        (
            publication_id,
            membre_id,
            contenu
        )


        VALUES
        (
            ?,
            ?,
            ?
        )

        `,
        [

            data.publication_id,

            data.membre_id,

            data.contenu

        ]
    );



    return result.insertId;

};







/**
 * Supprimer un commentaire
 */
const remove = async (
    id
) => {


    await db.query(
        `
        DELETE FROM commentaires

        WHERE id = ?

        `,
        [
            id
        ]
    );


};







/**
 * Compter les commentaires d'une publication
 */
const countByPublication = async (
    publication_id
) => {


    const [
        rows
    ] = await db.query(
        `
        SELECT
            COUNT(*) AS total


        FROM commentaires


        WHERE publication_id = ?

        `,
        [
            publication_id
        ]
    );


    return rows[0].total;

};







module.exports = {


    findByPublication,


    findById,


    create,


    remove,


    countByPublication


};