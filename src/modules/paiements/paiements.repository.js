const db = require('../../config/database');





/**
 * Liste tous les paiements
 * Admin
 */
/**
 * Liste tous les paiements
 * Admin avec filtres
 */
const findAll = async(filters = {})=>{


    const {

        recherche = "",

        statut = "",

        mode_paiement_id = "",

        date_debut = "",

        date_fin = "",

        limit = 10,

        offset = 0


    } = filters;





    let sql = `

        SELECT


            p.id,


            p.montant_attendu,

            p.montant_paye,

            p.difference,


            p.reference_transfert,

            p.preuve_image,


            p.statut,


            p.commentaire_admin,


            p.created_at,

            p.date_validation,



            m.id AS membre_id,

            m.nom_complet AS membre_nom,

            m.photo_identite AS membre_photo,



            c.id AS cotisation_id,

            c.titre AS cotisation_nom,



            tc.nom AS type_cotisation_nom,

            tc.periodicite,



            mp.id AS mode_id,

            mp.nom AS mode_nom



        FROM paiements p



        INNER JOIN membres m

            ON m.id = p.membre_id



        INNER JOIN cotisations c

            ON c.id = p.cotisation_id



        INNER JOIN types_cotisations tc

            ON tc.id = c.type_cotisation_id



        INNER JOIN modes_paiements mp

            ON mp.id = p.mode_paiement_id



        WHERE 1=1


    `;



    const params = [];







    /**
     * Recherche globale
     * membre
     * référence
     * cotisation
     */
    if(recherche){


        sql += `

        AND (

            m.nom_complet LIKE ?

            OR p.reference_transfert LIKE ?

            OR c.nom LIKE ?

        )

        `;


        const value =
            `%${recherche}%`;



        params.push(
            value,
            value,
            value
        );


    }







    /**
     * Filtre statut
     */
    if(statut){


        sql += `

        AND p.statut = ?

        `;


        params.push(
            statut
        );


    }








    /**
     * Filtre mode paiement
     */
    if(mode_paiement_id){


        sql += `

        AND p.mode_paiement_id = ?

        `;


        params.push(
            mode_paiement_id
        );


    }








    /**
     * Date début
     */
    if(date_debut){


        sql += `

        AND DATE(p.created_at) >= ?

        `;


        params.push(
            date_debut
        );


    }








    /**
     * Date fin
     */
    if(date_fin){


        sql += `

        AND DATE(p.created_at) <= ?

        `;


        params.push(
            date_fin
        );


    }








    sql += `

        ORDER BY p.created_at DESC


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







/**
 * Paiements d'un membre
 */
const findByMembre = async(
    membreId
)=>{


    const [rows] = await db.query(
        `
        SELECT


            p.id,


            p.montant_attendu,

            p.montant_paye,

            p.difference,


            p.reference_transfert,

            p.preuve_image,


            p.statut,


            p.commentaire_admin,


            p.created_at,

            p.date_validation,



            c.id AS cotisation_id,

            tc.nom AS cotisation_nom,

            tc.periodicite,



            mp.id AS mode_id,

            mp.nom AS mode_nom



        FROM paiements p



        INNER JOIN cotisations c

            ON c.id = p.cotisation_id

        INNER JOIN types_cotisations tc

            ON tc.id = c.type_cotisation_id



        INNER JOIN modes_paiements mp

            ON mp.id = p.mode_paiement_id



        WHERE p.membre_id = ?



        ORDER BY
            p.created_at DESC


        `,
        [
            membreId
        ]
    );



    return rows;


};









/**
 * Trouver un paiement
 */
const findById = async(id)=>{


    const [rows] = await db.query(
        `
        SELECT


            p.*,



            m.nom_complet AS membre_nom,



            c.titre AS cotisation_nom,



            mp.nom AS mode_nom



        FROM paiements p



        INNER JOIN membres m

            ON m.id = p.membre_id



        INNER JOIN cotisations c

            ON c.id = p.cotisation_id



        INNER JOIN modes_paiements mp

            ON mp.id = p.mode_paiement_id



        WHERE p.id = ?



        LIMIT 1


        `,
        [
            id
        ]
    );



    return rows[0];

};









/**
 * Création paiement
 */
const create = async(data)=>{


    const [result] = await db.query(
        `
        INSERT INTO paiements
        (

            membre_id,

            cotisation_id,

            mode_paiement_id,


            montant_attendu,

            montant_paye,

            difference,


            reference_transfert,


            preuve_image,

            preuve_public_id

        )


        VALUES

        (?,?,?,?,?,?,?,?,?)


        `,
        [

            data.membre_id,

            data.cotisation_id,

            data.mode_paiement_id,


            data.montant_attendu,

            data.montant_paye,

            data.difference,


            data.reference_transfert,


            data.preuve_image,

            data.preuve_public_id

        ]
    );



    return result.insertId;


};









/**
 * Validation paiement
 */
const validate = async(
    id,
    adminId
)=>{


    await db.query(
        `
        UPDATE paiements


        SET


            statut = 'valide',


            valide_par = ?,


            date_validation = NOW()



        WHERE id = ?


        `,
        [

            adminId,

            id

        ]
    );


};









/**
 * Refus paiement
 */
const refuse = async(
    id,
    adminId,
    commentaire
)=>{


    await db.query(
        `
        UPDATE paiements


        SET


            statut = 'refuse',


            valide_par = ?,


            commentaire_admin = ?,


            date_validation = NOW()



        WHERE id = ?


        `,
        [

            adminId,

            commentaire,


            id

        ]
    );


};



/**
 * Compter les paiements avec filtres
 * ADMIN
 */
const countAll = async(filters = {})=>{


    let query = `

        SELECT COUNT(*) AS total

        FROM paiements p

        INNER JOIN membres m
            ON m.id = p.membre_id

        INNER JOIN cotisations c
            ON c.id = p.cotisation_id

        INNER JOIN modes_paiements mp
            ON mp.id = p.mode_paiement_id

        WHERE 1=1

    `;


    const params = [];





    if(filters.statut){


        query += `
            AND p.statut = ?
        `;


        params.push(
            filters.statut
        );

    }





    if(filters.mode_paiement_id){


        query += `
            AND p.mode_paiement_id = ?
        `;


        params.push(
            filters.mode_paiement_id
        );

    }





    if(filters.recherche){


        query += `

            AND (

                m.nom_complet LIKE ?

                OR

                p.reference_transfert LIKE ?

                OR

                c.nom LIKE ?

            )

        `;


        const search =
            `%${filters.recherche}%`;


        params.push(search);
        params.push(search);
        params.push(search);

    }






    if(filters.date_debut){


        query += `
            AND DATE(p.created_at) >= ?
        `;


        params.push(
            filters.date_debut
        );

    }






    if(filters.date_fin){


        query += `
            AND DATE(p.created_at) <= ?
        `;


        params.push(
            filters.date_fin
        );

    }





    const [rows] =
        await db.query(
            query,
            params
        );



    return rows[0].total;


};




module.exports = {


    findAll,


    findByMembre,


    findById,


    create,


    validate,


    refuse,

    countAll


};