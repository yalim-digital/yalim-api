const db = require('../../config/database');

/**
 * Liste des partenaires (public)
 */
const findAll = async () => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            nom,
            logo,
            site_web,
            actif,
            ordre
        FROM partenaires
        ORDER BY ordre ASC, id DESC
        `
    );

    return rows;
};

/**
 * Trouver un partenaire par ID
 */
const findById = async (id) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM partenaires
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0];
};

/**
 * Création
 */
const create = async (data) => {
    const [result] = await db.query(
        `
        INSERT INTO partenaires
        (nom, logo, site_web, ordre,actif)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            data.nom,
            data.logo,
            data.site_web,
            data.ordre || 0,
            data.actif || 0
        ]
    );

    return result.insertId;
};

/**
 * Mise à jour
 */
const update = async (id, data) => {
    await db.query(
        `
        UPDATE partenaires
        SET
            nom = ?,
            logo = ?,
            site_web = ?,
            ordre = ?,
            actif = ?
        WHERE id = ?
        `,
        [
            data.nom,
            data.logo,
            data.site_web,
            data.ordre || 0,
            data.actif || 0,
            id
        ]
    );
};

/**
 * Suppression
 */
const remove = async (id) => {
    await db.query(
        `
        DELETE FROM partenaires
        WHERE id = ?
        `,
        [id]
    );
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};