const db =
require('../../config/database');









/**
 * Liste admin
 */
const findAll = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT *

            FROM documents_publics

            ORDER BY ordre ASC, id DESC

            `

        );



    return rows;


};









/**
 * Liste publique
 */
const findPublic = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT *

            FROM documents_publics

            WHERE actif = 1

            ORDER BY ordre ASC

            `

        );



    return rows;


};









/**
 * FIND BY ID
 */
const findById = async(id)=>{


    const [rows] =
        await db.query(

            `
            SELECT *

            FROM documents_publics

            WHERE id = ?

            LIMIT 1

            `,

            [id]

        );



    return rows[0];


};









/**
 * CREATE
 */
const create = async(data)=>{


    const [result] =
        await db.query(

            `
            INSERT INTO documents_publics
            (

                titre,

                description,

                fichier_url,

                fichier_public_id,

                type_fichier,

                categorie,

                taille,

                ordre,

                actif

            )

            VALUES (?,?,?,?,?,?,?,?,?)

            `,

            [

                data.titre,

                data.description,

                data.fichier_url,

                data.fichier_public_id,

                data.type_fichier || null,

                data.categorie || null,

                data.taille || null,

                data.ordre ?? 0,

                data.actif ?? 1

            ]

        );



    return result.insertId;


};









/**
 * UPDATE
 */
const update = async(id, data)=>{


    const fields = [];
    const values = [];



    Object.keys(data)
        .forEach(key=>{

            fields.push(`${key} = ?`);
            values.push(data[key]);

        });



    if(fields.length === 0){

        return;

    }



    values.push(id);



    await db.query(

        `
        UPDATE documents_publics

        SET ${fields.join(',')}

        WHERE id = ?

        `,

        values

    );



    return id;


};









/**
 * DELETE
 */
const remove = async(id)=>{


    await db.query(

        `
        DELETE FROM documents_publics

        WHERE id = ?

        `,

        [id]

    );


};









module.exports = {

    findAll,
    findPublic,
    findById,
    create,
    update,
    remove

};