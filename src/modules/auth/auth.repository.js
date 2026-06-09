const db = require('../../config/database');

const findByEmail = async (email) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM membres
        WHERE email = ?
        AND deleted_at IS NULL
        LIMIT 1
        `,
        [email]
    );

    return rows[0];
};

const findById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            matricule,
            nom_complet,
            email,
            telephone,
            role,
            statut,
            created_at
        FROM membres
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0];
};

const create = async (data) => {

    const [result] = await db.query(
        `
        INSERT INTO membres
        (
            matricule,
            nom_complet,
            email,
            telephone,
            sexe,
            mot_de_passe,
            statut,
            role
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            data.matricule,
            data.nom_complet,
            data.email,
            data.telephone,
            data.sexe,
            data.mot_de_passe,
            data.statut,
            data.role
        ]
    );

    return result.insertId;
};

module.exports = {
    findByEmail,
    findById,
    create
};