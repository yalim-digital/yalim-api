const db =
require('../../config/database');









/**
 * Liste toutes les valeurs
 *
 * ADMIN
 */
const findAll = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM valeurs


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

            FROM valeurs


            WHERE actif = 1


            ORDER BY ordre ASC

            `

        );



    return rows;


};









/**
 * Trouver une valeur
 */
const findById = async(
    id
)=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM valeurs


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
            INSERT INTO valeurs
            (

                nom,

                description,

                icone,

                ordre,

                actif

            )


            VALUES

            (?,?,?,?,?)

            `,

            [

                data.nom,

                data.description,

                data.icone || null,

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
        UPDATE valeurs

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
        DELETE FROM valeurs

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