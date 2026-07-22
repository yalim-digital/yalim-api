const db =
require('../../config/database');








/**
 * Liste tous les chiffres
 *
 * Admin
 */
const findAll = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM home_stats


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

            FROM home_stats


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

            FROM home_stats


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
const create = async(
    data
)=>{


    const [result] =
        await db.query(

            `
            INSERT INTO home_stats
            (

                icone,

                valeur,

                texte,

                ordre,

                actif

            )


            VALUES

            (?,?,?,?,?)

            `,

            [

                data.icone,

                data.valeur,

                data.texte,

                data.ordre ?? 0,

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
        UPDATE home_stats


        SET

            ${fields.join(',')}


        WHERE id = ?

        `,

        values

    );




    return id;


};









/**
 * Suppression
 */
const remove = async(
    id
)=>{


    await db.query(

        `
        DELETE FROM home_stats


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