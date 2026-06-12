const db = require('../../config/database');

const findByEmail = async (email) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            matricule,
            nom_complet,
            email,
            telephone,
            mention,
            parcours,
            niveau,
            date_naissance,
            photo_identite,
            sexe,
            cin,
            statut,
            type_membre,
            role,
            created_at
        FROM membres
        WHERE email = ?
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
            mention,
            parcours,
            niveau,
            date_naissance,
            photo_identite,
            sexe,
            cin,
            statut,
            type_membre,
            role,
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
            mention,
            parcours,
            niveau,
            date_naissance,
            photo_identite,
            sexe,
            cin,
            mot_de_passe,
            statut,
            type_membre,
            role
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            data.matricule,
            data.nom_complet,
            data.email,
            data.telephone,
            data.mention,
            data.parcours,
            data.niveau,
            data.date_naissance,
            data.photo_identite,
            data.sexe,
            data.cin,
            data.mot_de_passe,
            data.statut,
            data.type_membre,
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