const db =
require('../../config/database');







/**
 * Récupérer le Hero actif
 * Public
 */
const find = async()=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM home_hero


            WHERE actif = 1


            LIMIT 1

            `

        );



    return rows[0];

};









/**
 * Récupérer par ID
 */
const findById = async(
    id
)=>{


    const [rows] =
        await db.query(

            `
            SELECT

                *

            FROM home_hero


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
 * Création Hero
 *
 * utilisé si la table est vide
 */
const create = async(
    data
)=>{


    const [result] =
        await db.query(

            `
            INSERT INTO home_hero
            (

                badge,

                titre,

                sous_titre,

                description,

                image,

                image_public_id,

                boutons,

                actif


            )


            VALUES

            (?,?,?,?,?,?,?,?)

            `,

            [

                data.badge,

                data.titre,

                data.sous_titre,

                data.description,

                data.image,

                data.image_public_id,

                data.boutons,

                data.actif ?? 1

            ]

        );



    return result.insertId;


};









/**
 * Mise à jour Hero
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
        UPDATE home_hero


        SET

            ${fields.join(',')}



        WHERE id = ?

        `,

        values

    );





    return id;


};









/**
 * Supprimer Hero
 */
const remove = async(
    id
)=>{


    await db.query(

        `
        DELETE FROM home_hero


        WHERE id = ?

        `,

        [
            id
        ]

    );


};







module.exports = {


    find,


    findById,


    create,


    update,


    remove


};