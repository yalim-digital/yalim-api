const db =
require('../../config/database');









/**
 * Liste toutes les identités
 *
 * ADMIN
 */
const findAll = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM identites


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
            SELECT

                *

            FROM identites


            WHERE actif = 1


            ORDER BY ordre ASC

            `

        );



    return rows;


};









/**
 * Trouver une identité
 */
const findById = async(
    id
)=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM identites


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
 * Création identité
 */
const create = async(
    data
)=>{


    const [result] =
        await db.query(

            `
            INSERT INTO identites
            (

                type,

                contenu,

                icone,

                ordre,

                actif


            )


            VALUES

            (?,?,?,?,?)

            `,

            [

                data.type,

                data.contenu,

                data.icone || null,

                data.ordre ?? 0,

                data.actif ?? 1

            ]

        );



    return result.insertId;


};









/**
 * Modification identité
 */
const update = async(
    id,
    data
)=>{


    const fields = [];

    const values = [];







    Object.keys(data)
    .forEach(
        key=>{


            fields.push(

                `${key} = ?`

            );


            values.push(

                data[key]

            );


        }
    );







    if(fields.length === 0){

        return;

    }







    values.push(id);







    await db.query(

        `
        UPDATE identites


        SET

            ${fields.join(',')}


        WHERE id = ?

        `,

        values

    );







    return id;


};









/**
 * Suppression identité
 */
const remove = async(
    id
)=>{


    await db.query(

        `
        DELETE FROM identites


        WHERE id = ?

        `,

        [
            id
        ]

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