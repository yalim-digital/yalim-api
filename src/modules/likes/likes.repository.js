const db = require('../../config/database');



/**
 * Vérifier si un membre a liké
 * une publication
 */
const findUserLike = async(
    publication_id,
    membre_id
)=>{

    const [
        rows
    ] = await db.query(
        `
        SELECT id

        FROM likes

        WHERE publication_id = ?
        AND membre_id = ?

        LIMIT 1
        `,
        [
            publication_id,
            membre_id
        ]
    );

    return rows[0];

};






/**
 * Ajouter un like
 */
const create = async(
    publication_id,
    membre_id
)=>{

    const [
        result
    ] = await db.query(
        `
        INSERT INTO likes
        (
            publication_id,
            membre_id
        )

        VALUES
        (
            ?,
            ?
        )
        `,
        [
            publication_id,
            membre_id
        ]
    );

    return result.insertId;

};







/**
 * Supprimer un like
 */
const remove = async(
    publication_id,
    membre_id
)=>{

    await db.query(
        `
        DELETE FROM likes

        WHERE publication_id = ?
        AND membre_id = ?
        `,
        [
            publication_id,
            membre_id
        ]
    );

};








/**
 * Nombre total de likes
 */
const countByPublication = async(
    publication_id
)=>{

    const [
        rows
    ] = await db.query(
        `
        SELECT
            COUNT(*) AS total

        FROM likes

        WHERE publication_id = ?
        `,
        [
            publication_id
        ]
    );

    return rows[0].total;

};








/**
 * Liste des membres ayant liké
 * (utile plus tard)
 */
const findByPublication = async(
    publication_id
)=>{

    const [
        rows
    ] = await db.query(
        `
        SELECT

            m.id,
            m.nom_complet,
            m.photo_identite

        FROM likes l

        INNER JOIN membres m

            ON m.id = l.membre_id

        WHERE l.publication_id = ?

        ORDER BY l.created_at DESC
        `,
        [
            publication_id
        ]
    );

    return rows;

};







module.exports = {

    findUserLike,

    create,

    remove,

    countByPublication,

    findByPublication

};