const db = require('../../config/database');

/**
 * Récupérer le settings (singleton)
 */
const find = async () => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM settings
        LIMIT 1
        `
    );

    return rows[0];
};

/**
 * Créer settings (1 seule fois)
 */
const create = async (data) => {
    const [result] = await db.query(
        `
        INSERT INTO settings (
            email,
            telephone,
            adresse,
            facebook,
            instagram,
            tiktok,
            youtube
        )
        VALUES (?,?,?,?,?,?,?)
        `,
        [
          
            data.email,
            data.telephone,
            data.adresse,
            data.facebook,
            data.instagram,
            data.tiktok,
            data.youtube
        ]
    );

    return result.insertId;
};

/**
 * UPDATE singleton
 */
const update = async (data) => {
    await db.query(
        `
        UPDATE settings
        SET
          
            email = ?,
            telephone = ?,
            adresse = ?,
            facebook = ?,
            instagram = ?,
            tiktok = ?,
            youtube = ?
        WHERE id = 1
        `,
        [
           
            data.email,
            data.telephone,
            data.adresse,
            data.facebook,
            data.instagram,
            data.tiktok,
            data.youtube
        ]
    );
};

module.exports = {
    find,
    create,
    update
};