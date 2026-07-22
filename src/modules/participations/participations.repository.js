const db = require('../../config/database');

const findByMemberAndActivity = async (
    membreId,
    activiteId
) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM participations_activities
        WHERE membre_id = ?
        AND activitie_id = ?
        LIMIT 1
        `,
        [
            membreId,
            activiteId
        ]
    );

    return rows[0];

};

const create = async (
    data
) => {

    const [result] =
        await db.query(
            `
            INSERT INTO participations_activities
            (
                membre_id,
                activitie_id,
                statut,
                montant_declare,
                contribution
            )
            VALUES
            (?, ?, ?, ?, ?)
            `,
            [
                data.membre_id,
                data.activite_id,
                data.statut,
                data.montant_declare,
                data.contribution
            ]
        );

    return result.insertId;

};

const remove = async (
    membreId,
    activiteId
) => {

    await db.query(
        `
        DELETE FROM participations_activities
        WHERE membre_id = ?
        AND activitie_id = ?
        `,
        [
            membreId,
            activiteId
        ]
    );

};

const getMyParticipations = async (
    membreId,
    limit,
    offset
) => {


    const [rows] = await db.query(
        `
        SELECT

            p.id,
            p.statut,
            p.created_at,
            p.montant_declare,
            p.contribution,
            p.qr_token,
            p.qr_used,
            p.qr_scanned_at,


            a.id AS activitie_id,
            a.titre,
            a.description,
            a.image,
            a.lieu,
            a.date_debut,
            a.date_fin,
            a.type_activite,
            a.montant


        FROM participations_activities p


        INNER JOIN activities a

            ON a.id = p.activitie_id



        WHERE p.membre_id = ?



        ORDER BY 
            a.date_debut ASC



        LIMIT ? OFFSET ?

        `,
        [
            membreId,
            Number(limit),
            Number(offset)
        ]
    );


    return rows;

};

const countMyParticipations = async (
    membreId
)=>{


    const [
        rows
    ] = await db.query(
        `
        SELECT COUNT(*) AS total

        FROM participations_activities

        WHERE membre_id = ?

        `,
        [
            membreId
        ]
    );


    return rows[0].total;

};

const validateParticipation =
async (
    participationId,
    adminId
) => {

    await db.query(
        `
        UPDATE participations_activities
        SET
            statut = 'valide',
            valide_par = ?,
            valide_at = NOW()
        WHERE id = ?
        `,
        [
            adminId,
            participationId
        ]
    );

};

const markPresent =
async (id) => {

    await db.query(
        `
        UPDATE participations_activities
        SET statut = 'present'
        WHERE id = ?
        `,
        [id]
    );

};

const markAbsent =
async (id) => {

    await db.query(
        `
        UPDATE participations_activities
        SET statut = 'absent'
        WHERE id = ?
        `,
        [id]
    );

};

const getActivityParticipations =
async (
    activiteId
) => {

    const [rows] =
        await db.query(
            `
            SELECT

                p.*,

                m.nom_complet,
                m.email,
                m.telephone,

                a.titre

            FROM participations_activities p

            INNER JOIN membres m
                ON m.id = p.membre_id

            INNER JOIN activities a
                ON a.id = p.activitie_id

            WHERE a.id = ?

            ORDER BY p.created_at DESC
            `,
            [activiteId]
        );

    return rows;

};

const getByActivite = async (
    activiteId
) => {

    const [rows] = await db.query(
        `
        SELECT

            p.id,
            p.statut,
            p.montant_declare,
            p.montant_valide,
            p.contribution,
            p.created_at,
            p.qr_token,
            p.qr_used,
            p.qr_scanned_at,

            m.id AS membre_id,
            m.nom_complet,
            m.email,
            m.telephone,

            a.id as activitie_id,
            a.titre,
            a.description,
            a.image,
            a.lieu,
            a.date_debut,
            a.date_fin,
            a.type_activite,
            a.montant

        FROM participations_activities p

        INNER JOIN membres m
            ON m.id = p.membre_id

        INNER JOIN activities a
            ON a.id = p.activitie_id

        WHERE p.activitie_id = ?

        ORDER BY p.created_at DESC

        `,
        [
            activiteId
        ]
    );


    return rows;

};

const validate = async (
    id,
    adminId,
    montantValide = null
) => {


    await db.query(
        `
        UPDATE participations_activities

        SET

            statut = 'valide',

            valide_par = ?,

            valide_at = NOW(),

            montant_valide = ?

        WHERE id = ?

        `,
        [
            adminId,
            montantValide,
            id
        ]
    );


};

const present = async(id)=>{


    await db.query(
        `
        UPDATE participations_activities

        SET statut='present'

        WHERE id=?

        `,
        [
            id
        ]
    );

};

const absent = async(id)=>{


    await db.query(
        `
        UPDATE participations_activities

        SET statut='absent'

        WHERE id=?

        `,
        [
            id
        ]
    );

};

const getMyPreview = async (membreId) => {

    const [rows] = await db.query(
        `
        SELECT

            p.id,
            p.statut,
            p.montant_declare,
            p.montant_valide,
            p.contribution,
            p.qr_token,
            p.qr_used,
            p.qr_scanned_at,

            a.titre,
            a.date_debut,
            a.type_activite,
            a.image

        FROM participations_activities p

        INNER JOIN activities a
            ON a.id = p.activitie_id

        WHERE p.membre_id = ?

        ORDER BY a.date_debut DESC

        LIMIT 3
        `,
        [membreId]
    );

    return rows;
};

const getMyParticipationIds = async(
    membreId
)=>{


    const [
        rows
    ] = await db.query(
        `
        SELECT activitie_id

        FROM participations_activities

        WHERE membre_id = ?

        AND statut != 'annule'

        `,
        [
            membreId
        ]
    );


    return rows.map(
        item => item.activitie_id
    );


};

const updateQrToken = async(
    id,
    token
)=>{


    await db.query(
        `
        UPDATE participations_activities

        SET

        qr_token = ?,

        qr_used = 0

        WHERE id = ?
        AND qr_token IS NULL

        `,
        [
            token,
            id
        ]
    );


};

const getQRCode = async(
membreId,
id
)=>{


const [rows] =
await db.query(
`
SELECT

qr_token,
qr_used,
statut

FROM participations_activities

WHERE id=?

AND membre_id=?

LIMIT 1

`,
[
id,
membreId
]
);


return rows[0];


};

const findByQrToken = async(
    token
)=>{


const [
    rows
] = await db.query(
`
SELECT

p.*,

m.nom_complet,
m.id as membre_id,
m.matricule as membre_matricule,
m.photo_identite,
m.email,

a.titre,
a.date_debut,
a.date_fin

FROM participations_activities p


INNER JOIN membres m

ON m.id = p.membre_id


INNER JOIN activities a

ON a.id = p.activitie_id


WHERE p.qr_token = ?

LIMIT 1

`,
[
token
]
);


return rows[0];

};

const checkin = async(
    id,
    adminId
)=>{


await db.query(
`
UPDATE participations_activities

SET

statut='present',

qr_used=1,

qr_scanned_at=NOW(),

scanned_by=?

WHERE id=?

`,
[
adminId,
id
]
);


};


module.exports = {
    findByMemberAndActivity,
    create,
    remove,
    getMyParticipations,
    validateParticipation,
    markPresent,
    markAbsent,
    getActivityParticipations,
    getByActivite,
    validate,
    present,
    absent,
    getMyPreview,
    countMyParticipations,
    getMyParticipationIds,
    updateQrToken,
    getQRCode,
    checkin,
    findByQrToken
};