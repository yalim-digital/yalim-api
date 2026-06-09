const db = require('../config/database');

const findByEmail = async (email) => {

    const [rows] =
        await db.promise().query(
            'SELECT * FROM membres WHERE email = ?',
            [email]
        );

    return rows[0];
};

const create = async (user) => {

    const sql = `
        INSERT INTO membres (
            matricule,
            nom_complet,
            email,
            mot_de_passe
        )
        VALUES (?, ?, ?, ?)
    `;

    const [result] =
        await db.promise().query(
            sql,
            [
                user.matricule,
                user.nom_complet,
                user.email,
                user.mot_de_passe
            ]
        );

    return result;
};

module.exports = {
    findByEmail,
    create
};