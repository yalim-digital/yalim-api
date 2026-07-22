const db = require('../../config/database');



/**
 * Liste des modes de paiement
 */
const findAll = async()=>{


    const [rows] = await db.query(
        `
        SELECT

            id,
            nom,
            description,
            numero_compte,
            titulaire,
            actif,
            created_at


        FROM modes_paiements


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
            numero_compte,
            titulaire,
            actif,
            created_at


        FROM modes_paiements


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
        INSERT INTO modes_paiements
        (
            nom,
            description,
            numero_compte,
            titulaire
        )


        VALUES
        (?,?,?,?)

        `,
        [

            data.nom,

            data.description,

            data.numero_compte,

            data.titulaire

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
        UPDATE modes_paiements


        SET

            nom = ?,

            description = ?,

            numero_compte = ?,

            titulaire = ?,

            actif = ?



        WHERE id = ?

        `,
        [

            data.nom,

            data.description,

            data.numero_compte,

            data.titulaire,

            data.actif,

            id

        ]
    );


};








/**
 * Désactivation
 */
const remove = async(id)=>{


    await db.query(
        `
        UPDATE modes_paiements


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