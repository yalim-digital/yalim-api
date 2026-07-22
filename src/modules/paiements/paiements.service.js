const repository =
require('./paiements.repository');


const cotisationRepository =
require('../cotisations/cotisations.repository');


const cloudinary =
    require('../../config/cloudinary');

const uploadToCloudinary =
    require('../../utils/uploadToCloudinary');





/**
 * LISTE ADMIN
 * avec filtres + pagination
 */
const getAll = async(filters)=>{


    const data =
        await repository.findAll(
            filters
        );



    const total =
        await repository.countAll(
            filters
        );



    const page =
        Math.floor(
            filters.offset / filters.limit
        )
        +
        1;



    return {

        data,


        pagination:{

            page,

            limit:
                Number(filters.limit),

            total,

            pages:
                Math.ceil(
                    total /
                    Number(filters.limit)
                )

        }

    };


};









/**
 * LISTE MEMBRE
 */
const getByMembre = async(membreId)=>{


    return await repository.findByMembre(
        membreId
    );


};









/**
 * CREATE PAYMENT (MEMBRE)
 */
const create = async(
    data,
    file,
    membreId
)=>{


    /**
     * 1. Vérifier cotisation
     */
    const cotisation =
        await cotisationRepository.findById(
            data.cotisation_id
        );


    if(!cotisation){

        throw new Error(
            "Cotisation introuvable"
        );

    }






    /**
     * 2. Vérifier paiement déjà existant
     */
    const existing =
        await repository.findByMembre(membreId);


const alreadyPaid =
    existing.find(p =>

        p.cotisation_id == data.cotisation_id

        &&

        (
            p.statut === "en_attente"

            ||

            p.statut === "valide"
        )

    );


    if(alreadyPaid){

        throw new Error(
            "Vous avez déjà payé cette cotisation"
        );

    }






    /**
     * 3. Montant attendu
     */
    const montant_attendu =
        cotisation.montant;





    /**
     * 4. Calcul différence
     */
    const montant_paye =
        Number(data.montant_paye);


    const difference =
        montant_paye - montant_attendu;






    /**
     * 5. Upload preuve (optionnel)
     */
    let preuve_image = null;
    let preuve_public_id = null;


    if(file){


        const upload =
            await uploadToCloudinary(
                file.buffer,
                "paiements"
            );


        preuve_image =
            upload.secure_url;


        preuve_public_id =
            upload.public_id;

    }






    /**
     * 6. CREATE PAYMENT
     */
    const id =
        await repository.create({

            membre_id:
                membreId,

            cotisation_id:
                data.cotisation_id,

            mode_paiement_id:
                data.mode_paiement_id,

            montant_attendu,

            montant_paye,

            difference,

            reference_transfert:
                data.reference_transfert,

            preuve_image,

            preuve_public_id

        });





    return {

        id,

        message:
            "Paiement enregistré avec succès"

    };


};









/**
 * VALIDATE (ADMIN)
 */
const validate = async(
    id,
    adminId
)=>{


    const payment =
        await repository.findById(id);


    if(!payment){

        throw new Error(
            "Paiement introuvable"
        );

    }




    await repository.validate(
        id,
        adminId
    );



    return {

        message:
            "Paiement validé"
    };


};









/**
 * REFUSE (ADMIN)
 */
const refuse = async(
    id,
    adminId,
    commentaire
)=>{


    const payment =
        await repository.findById(id);


    if(!payment){

        throw new Error(
            "Paiement introuvable"
        );

    }




    await repository.refuse(
        id,
        adminId,
        commentaire
    );



    return {

        message:
            "Paiement refusé"
    };


};








/**
 * GET ONE
 */
const getById = async(id)=>{


    const payment =
        await repository.findById(id);


    if(!payment){

        throw new Error(
            "Paiement introuvable"
        );

    }



    return payment;


};









module.exports = {

    getAll,

    getByMembre,

    getById,

    create,

    validate,

    refuse

};