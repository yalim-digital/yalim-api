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

const findAdmin = async () => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM membres
        WHERE role = ?
        AND deleted_at IS NULL
        `,
        ['admin']
    );

    return rows;
};

const findAll = async () => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM membres
        WHERE deleted_at IS NULL
        `
    );

    return rows;
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
            is_active,
            active_par,
            note,
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
            role,
            is_active,
            note,
            active_par
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
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
            data.role,
            data.is_active,
            data.note,
            data.active_par
        ]
    );

    return result.insertId;
};

const updateProfil = async (
    id,
    photo_identite
) => {

    await db.query(
        `
        UPDATE membres
        SET
            photo_identite = ?
        WHERE id = ?
        `,
        [
            photo_identite,
            id
        ]
    );

    return true;
};

const updatePassword = async (
    id,
    password
) => {

    await db.query(
        `
        UPDATE membres
        SET
            mot_de_passe = ?
        WHERE id = ?
        `,
        [
            password,
            id
        ]
    );

    return true;
};

/**
 * Modification identité
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
        UPDATE membres


        SET

            ${fields.join(',')}


        WHERE id = ?

        `,

        values

    );







    return id;


};

/**
 * Compter les membres avec filtres
 * ADMIN
 */
const countAll = async(filters = {})=>{


    let query = `

        SELECT COUNT(*) AS total

        FROM membres m 

        WHERE 1=1

    `;


    const params = [];





    if(filters.is_active){


        query += `
            AND m.is_active = ?
        `;


        params.push(
            filters.is_active
        );

    }



    if(filters.recherche){


        query += `

            AND (

                m.nom_complet LIKE ?

                OR

                m.niveau LIKE ?

                OR

                m.mention LIKE ?

                OR

                m.cin LIKE ?

            )

        `;


        const search =
            `%${filters.recherche}%`;


        params.push(search);
        params.push(search);
        params.push(search);
        params.push(search);

    }





    const [rows] =
        await db.query(
            query,
            params
        );



    return rows[0].total;


};

const findAllAdmin = async(filters = {})=>{


    const {

        recherche = "",

        is_active = "",

        limit = 10,

        offset = 0


    } = filters;





    let sql = `

        SELECT

            m.id,
            m.matricule,
            m.nom_complet,
            m.email,
            m.telephone,
            m.mention,
            m.parcours,
            m.niveau,
            m.date_naissance,
            m.photo_identite,
            m.sexe,
            m.cin,
            m.statut,
            m.is_active,

            m.active_par,

            activeur.nom_complet 
            AS active_par_nom,

            m.type_membre,
            m.role,
            m.created_at


        FROM membres m


        LEFT JOIN membres activeur

            ON activeur.id = m.active_par


        WHERE 1=1


    `;



    const params = [];





    /**
     * Recherche globale
     */
    if(recherche){


        sql += `

        AND (

                m.nom_complet LIKE ?

                OR m.niveau LIKE ?

                OR m.mention LIKE ?

                OR m.cin LIKE ?

                OR m.email LIKE ?

                OR m.matricule LIKE ?

        )

        `;


        const value =
            `%${recherche}%`;



        params.push(
            value,
            value,
            value,
            value,
            value,
            value
        );


    }







    /**
     * Filtre statut
     */
    if(is_active !== ""){


        sql += `

        AND m.is_active = ?

        `;


        params.push(
            Number(is_active)
        );


    }







    sql += `

        ORDER BY m.created_at DESC


        LIMIT ?

        OFFSET ?

    `;



    params.push(
        Number(limit),
        Number(offset)
    );







    const [rows] =
        await db.query(
            sql,
            params
        );



    return rows;


};

module.exports = {
    findByEmail,
    findById,
    create,
    update,
    updateProfil,
    updatePassword,
    findAll,
    findAdmin,
    countAll,
    findAllAdmin
};