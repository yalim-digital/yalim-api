const db = require('../../config/database');

/**
 * GET CTA (singleton)
 */
const find = async () => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM home_cta
        LIMIT 1
        `
    );

    return rows[0];
};

/**
 * CREATE CTA (initial)
 */
const create = async (data) => {
    const [result] = await db.query(
        `
        INSERT INTO home_cta (
            titre,
            description,
            texte_bouton,
            lien,
            image
        )
        VALUES (?,?,?,?,?)
        `,
        [
            data.titre,
            data.description,
            data.texte_bouton,
            data.lien,
            data.image
        ]
    );

    return result.insertId;
};

/**
 * UPDATE CTA
 */
const update = async (data) => {
    await db.query(
        `
        UPDATE home_cta
        SET
            titre = ?,
            description = ?,
            texte_bouton = ?,
            lien = ?,
            image = ?
        WHERE id = 1
        `,
        [
            data.titre,
            data.description,
            data.texte_bouton,
            data.lien,
            data.image
        ]
    );
};

module.exports = {
    find,
    create,
    update
};