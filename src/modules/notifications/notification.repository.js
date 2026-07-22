// repositories/notificationRepository.js

const db = require("../../config/database");

/**
 * Créer une notification
 */
const create = async (data) => {
    const [result] = await db.query(
        `
        INSERT INTO notifications
        (
            membre_id,
            titre,
            message,
            type,
            reference_id,
            lien
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            data.membre_id,
            data.titre,
            data.message,
            data.type,
            data.reference_id || null,
            data.lien || null
        ]
    );

    return result.insertId;
};

/**
 * Notifications d'un membre
 */
const findByMember = async (membre_id) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM notifications
        WHERE membre_id = ?
        ORDER BY created_at DESC
        `,
        [membre_id]
    );

    return rows;
};

/**
 * Nombre de notifications non lues
 */
const countUnread = async (membre_id) => {
    const [rows] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM notifications
        WHERE membre_id = ?
        AND is_read = 0
        `,
        [membre_id]
    );

    return rows[0].total;
};

/**
 * Marquer une notification comme lue
 */
const markAsRead = async (id, membre_id) => {
    await db.query(
        `
        UPDATE notifications
        SET is_read = 1
        WHERE id = ?
        AND membre_id = ?
        `,
        [id, membre_id]
    );
};

/**
 * Marquer toutes les notifications comme lues
 */
const markAllAsRead = async (membre_id) => {
    await db.query(
        `
        UPDATE notifications
        SET is_read = 1
        WHERE membre_id = ?
        `,
        [membre_id]
    );
};

/**
 * Supprimer une notification
 */
const remove = async (id, membre_id) => {
    await db.query(
        `
        DELETE FROM notifications
        WHERE id = ?
        AND membre_id = ?
        `,
        [id, membre_id]
    );
};

/**
 * Créer plusieurs notifications en une seule requête
 */
const createMany = async (notifications) => {

    if (!notifications || notifications.length === 0) {
        return 0;
    }


    const values = notifications.map((notification) => [

        notification.membre_id,

        notification.titre,

        notification.message,

        notification.type,

        notification.reference_id || null,

        notification.lien || null

    ]);


    const [result] = await db.query(

        `
        INSERT INTO notifications
        (
            membre_id,
            titre,
            message,
            type,
            reference_id,
            lien
        )

        VALUES ?

        `,

        [
            values
        ]

    );


    return result.affectedRows;

};

module.exports = {
    create,
    findByMember,
    countUnread,
    markAsRead,
    markAllAsRead,
    remove,
    createMany
};