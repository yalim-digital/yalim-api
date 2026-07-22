const db =
require('../../config/database');









/**
 * Récupérer l'histoire
 *
 * Public
 */
const find = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM home_histoire


            WHERE actif = 1


            LIMIT 1

            `

        );



    return rows[0];


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

            FROM home_histoire


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
 *
 * Utilisé uniquement si table vide
 */
const create = async(
    data
)=>{


    const [result] =
        await db.query(

            `
            INSERT INTO home_histoire
            (

                titre,

                contenu1,

                contenu2,

                contenu3,

                actif


            )


            VALUES

            (?,?,?,?,?)

            `,

            [

                data.titre,

                data.contenu1,

                data.contenu2,

                data.contenu3,

                data.actif ?? 1

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
        UPDATE home_histoire


        SET

            ${fields.join(',')}


        WHERE id = ?

        `,

        values

    );







    return id;


};









module.exports = {


    find,


    findById,


    create,


    update


};