const db = require("../../config/database");


/**
 * Enregistrer un abonnement push
 */
const create = async ({
    membre_id,
    endpoint,
    p256dh,
    auth
}) => {


    const [
        result
    ] = await db.query(
        `
        INSERT INTO push_subscriptions
        (
            membre_id,
            endpoint,
            p256dh,
            auth
        )

        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
        `,
        [
            membre_id,
            endpoint,
            p256dh,
            auth
        ]
    );


    return result.insertId;

};





/**
 * Trouver les abonnements d'un membre
 */
const findByMember = async (
    membre_id
)=>{


    const [
        rows
    ] = await db.query(
        `
        SELECT *

        FROM push_subscriptions

        WHERE membre_id = ?

        `,
        [
            membre_id
        ]
    );


    return rows;

};





/**
 * Supprimer un abonnement
 */
const remove = async (
    endpoint
)=>{


    await db.query(
        `
        DELETE FROM push_subscriptions

        WHERE endpoint = ?

        `,
        [
            endpoint
        ]
    );


};





module.exports = {

    create,

    findByMember,

    remove

};