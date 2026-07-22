const db =
require('../../config/database');









/**
 * Liste des domaines d'action
 *
 * ADMIN
 */
const findAll = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM domaines_actions


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

            FROM domaines_actions


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

            FROM domaines_actions


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
 * Création domaine d'action
 */
const create = async(
    data
)=>{


    const [result] =
        await db.query(

            `
            INSERT INTO domaines_actions
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
 * Modification domaine d'action
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
        UPDATE domaines_actions


        SET

            ${fields.join(',')}


        WHERE id = ?

        `,

        values

    );



    return id;


};









/**
 * Suppression domaine d'action
 */
const remove = async(
    id
)=>{


    await db.query(

        `
        DELETE FROM domaines_actions

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