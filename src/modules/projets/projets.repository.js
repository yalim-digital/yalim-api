const db =
require('../../config/database');









/**
 * Liste projets
 *
 * ADMIN
 */
const findAll = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT *

            FROM projets

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

            FROM projets

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

            FROM projets

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
            INSERT INTO projets
            (

                categorie,

                titre,

                description,

                image,

                image_public_id,

                ordre,

                actif

            )

            VALUES (?,?,?,?,?,?,?)

            `,

            [

                data.categorie || null,

                data.titre,

                data.description || null,

                data.image || null,

                data.image_public_id || null,

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
        UPDATE projets

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
        DELETE FROM projets

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