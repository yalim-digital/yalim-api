const db = require('../../config/database');



/**
 * Liste des types de cotisations
 */
const findAll = async()=>{


    const [rows] = await db.query(
        `
        SELECT

            id,
            nom,
            description,
            periodicite,
            obligatoire,
            actif,
            created_at


        FROM types_cotisations


        ORDER BY created_at DESC

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

            id,
            nom,
            description,
            periodicite,
            obligatoire,
            actif,
            created_at


        FROM types_cotisations


        WHERE id = ?


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
        INSERT INTO types_cotisations
        (
            nom,
            description,
            periodicite,
            obligatoire
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
            data.nom,
            data.description,
            data.periodicite,
            data.obligatoire
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
        UPDATE types_cotisations


        SET

            nom = ?,

            description = ?,

            periodicite = ?,

            obligatoire = ?,

            actif = ?


        WHERE id = ?

        `,
        [
            data.nom,
            data.description,
            data.periodicite,
            data.obligatoire,
            data.actif,
            id
        ]
    );


};






/**
 * Suppression logique
 */
const remove = async(id)=>{


    await db.query(
        `
        UPDATE types_cotisations

        SET actif = 0


        WHERE id = ?

        `,
        [
            id
        ]
    );


};





module.exports = {


    findAll,

    findById,

    create,

    update,

    remove

};