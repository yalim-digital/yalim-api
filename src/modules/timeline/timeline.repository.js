const db =
require('../../config/database');









/**
 * Liste tous les éléments timeline
 *
 * ADMIN
 */
const findAll = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM timeline


            ORDER BY ordre ASC, id DESC

            `

        );



    return rows;


};









/**
 * Liste timeline publique
 */
const findPublic = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM timeline


            WHERE actif = 1


            ORDER BY ordre ASC

            `

        );



    return rows;


};









/**
 * Trouver par ID
 */
const findById = async(
    id
)=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM timeline


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
 * Création timeline
 */
const create = async(
    data
)=>{


    const [result] =
        await db.query(

            `
            INSERT INTO timeline
            (

                icone,

                titre,

                description,

                ordre,

                actif


            )


            VALUES

            (?,?,?,?,?)

            `,

            [

                data.icone,

                data.titre,

                data.description,

                data.ordre ?? 0,

                data.actif ?? 1

            ]

        );



    return result.insertId;


};









/**
 * Modification timeline
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
        UPDATE timeline


        SET

            ${fields.join(',')}


        WHERE id = ?

        `,

        values

    );






    return id;


};









/**
 * Suppression timeline
 */
const remove = async(
    id
)=>{


    await db.query(

        `
        DELETE FROM timeline


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