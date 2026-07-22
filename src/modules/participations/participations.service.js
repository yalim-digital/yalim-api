const repository =
    require('./participations.repository');

const activitesRepository =
    require('../activites/activites.repository');
const qrService =
    require('./qrcode.service');

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const participate = async (
    membreId,
    activiteId,
    payload
) => {

const activity =
    await activitesRepository
        .findById(
            activiteId
        );



    if (!activity) {

        throw new Error(
            'Activité introuvable'
        );

    }

    if(
        new Date(
            activity.date_debut
        ) <= new Date()
    ){

        throw new Error(
            "Impossible d'annuler une activité déjà commencée"
        );

    }

    



    const existing =
        await repository.findByMemberAndActivity(
            membreId,
            activiteId
        );

    if (existing) {

        throw new Error(
            'Vous êtes déjà inscrit'
        );

    }



    if(
        activity.type_activite
        === "payant"
    ){

        if(
            !payload.montant_declare
        ){

            throw new Error(
                "Montant obligatoire"
            );

        }

    }

   
    const statut =
    activity.type_activite === "gratuit"
    ?
    "valide"
    :
    "en_attente";


    const participationId =
    await repository.create({

        membre_id:membreId,

        activite_id:activiteId,

        statut,

        montant_declare:
            payload.montant_declare

    });

    let qr_token = null;


    if(
        statut === "valide"
    ){

        qr_token =
            qrService.generateToken();


        await repository.updateQrToken(
            participationId,
            qr_token
        );

    }
    return {

        success:true,

        message:
        statut === "valide"
        ?
        "Participation confirmée"
        :
        "Participation en attente de validation",


        qr_token

    };

};

const cancelParticipation = async (
    membreId,
    activiteId
) => {

    await repository.remove(
        membreId,
        activiteId
    );

    return {
        success: true,
        message:
            'Participation annulée'
    };

};

const getMyParticipations = async (
    membreId,
    page = 1,
    limit = 5
) => {


    const offset =
        (page - 1) * limit;



    const participations =
        await repository.getMyParticipations(
            membreId,
            limit,
            offset
        );



    const total =
        await repository.countMyParticipations(
            membreId
        );



    return {


        data: participations,


        pagination:{

            page:Number(page),

            limit:Number(limit),

            total,

            pages:
            Math.ceil(
                total / limit
            )

        }


    };


};

const getParticipantsAdmin = async(
    activiteId
)=>{


    return await repository
        .getByActivite(
            activiteId
        );

};

const validateParticipation = async(
    participationId,
    adminId,
    montantValide
)=>{


    await repository.validate(

    participationId,

    adminId,

    montantValide

);



const qr_token =
qrService.generateToken();



await repository.updateQrToken(
    participationId,
    qr_token
);


    return {

        success:true,

        message:
        "Participation validée",

        qr_token

    };

};

const markPresent = async(id)=>{


    await repository.present(id);


    return {

        success:true,

        message:
        "Membre marqué présent"

    };

};

const markAbsent = async(id)=>{


    await repository.absent(id);


    return {

        success:true,

        message:
        "Membre marqué absent"

    };

};

const getMyPreview = async (membreId) => {

    return repository.getMyPreview(
        membreId
    );

};

const getMyParticipationIds = async(
    membreId
)=>{


    return await repository
    .getMyParticipationIds(
        membreId
    );


};

const getQRCode = async(
membreId,
participationId
)=>{


return await repository.getQRCode(
    membreId,
    participationId
);


};

const checkin = async(
    qr_token,
    adminId
)=>{


const participation =
await repository.findByQrToken(
    qr_token
);



if(!participation){

    throw new Error(
        "QR Code invalide"
    );

}



if(
participation.qr_used
){

    throw new Error(
        "QR Code déjà utilisé"
    );

}



if(
participation.statut !== "valide"
){

    throw new Error(
        "Participation non validée"
    );

}



await repository.checkin(

    participation.id,

    adminId

);



return {

success:true,

message:
"Présence Confirmé",

membre:{
    id:participation.membre_id,
    nom:
    participation.nom_complet
},

activite:{
    id:participation.activitie_id,
    titre:
    participation.titre
}

};


};


const scanPreview = async(
    qr_token,
    adminId
)=>{


const participation =
await repository.findByQrToken(
    qr_token
);



if(!participation){

    throw new Error(
        "QR Code invalide"
    );

}




dayjs.extend(utc);
dayjs.extend(timezone);



const nowMadagascar =
    dayjs()
    .tz("Indian/Antananarivo");



const dateDebut =
    dayjs(participation.date_debut)
    .tz("Indian/Antananarivo");



if(
    dateDebut.isAfter(nowMadagascar)
){

    throw new Error(
        "Impossible d'assister à une activité à venir"
    );

}

if(
participation.qr_used
){

    throw new Error(
        "QR Code déjà utilisé"
    );

}



if(
participation.statut !== "valide"
){

    throw new Error(
        "Participation non validée"
    );

}



// await repository.checkin(

//     participation.id,

//     adminId

// );



return {

success:true,

message:
"Membre présent",

membre:{
    id:participation.membre_id,
    nom_complet:
    participation.nom_complet,
    photo:participation.photo_identite,
    titre:participation.titre,
    date_debut:participation.date_debut,
    statut:participation.statut,
    qr_used:participation.qr_used,
    qr_scanned_at:participation.qr_scanned_at,
    matricule:participation.membre_matricule,
    qr_token:participation.qr_token
}

};


};


module.exports = {
    participate,
    cancelParticipation,
    getMyParticipations,
    getParticipantsAdmin,
    validateParticipation,
    markPresent,
    markAbsent,
    getMyPreview,
    getMyParticipationIds,
    getQRCode,
    checkin,
    scanPreview
};