const repository =
    require('./activites.repository');

const notificationService =
    require('../notifications/notification.service');

const cloudinary =
    require('../../config/cloudinary');

const uploadToCloudinary =
    require('../../utils/uploadToCloudinary');


// Récupérer toutes les activités
const getAll = async () => {

    return await repository.findAll();

};


// Récupérer une activité
const getById = async (
    id
) => {

    const activite =
        await repository.findById(id);


    if (!activite) {
        console.log('Activité introuvable get By ID')
        throw new Error(
            "Activité introuvable"
        );

    }


    return activite;

};



// Upload image Cloudinary
const uploadImage = async (
    file
) => {

    if (!file) {
        return null;
    }


    const result =
        await uploadToCloudinary(
            file.buffer,
            'activites'
        );


    return {
        url: result.secure_url,
        public_id: result.public_id
    };

};



// Supprimer image Cloudinary
const deleteImage = async (
    public_id
) => {

    if (!public_id) {
        return;
    }


    await cloudinary
        .uploader
        .destroy(
            public_id
        );

};



// Création
const create = async (
    data,
    file,
    adminId
) => {


    // règle métier
    if (
        data.type_activite === "payant"
        &&
        (!data.montant ||
        Number(data.montant) <= 0)
    ) {

        throw new Error(
            "Le montant est obligatoire pour une activité payante"
        );

    }



    if (
        data.type_activite !== "payant"
    ) {

        data.montant = null;

    }



    // Upload image
    const image =
        await uploadImage(file);



    const activite = {

        ...data,

        image:
            image?.url || null,

        image_public_id:
            image?.public_id || null,

        created_by:
            adminId

    };



    const activiteId= await repository.create(
        activite
    );

    notificationService.notifyAllMembers({

            membre_id:11,

            titre: activite.titre,

            title: activite.titre,

            message: activite.titre+"\n"+activite.description,

            type: "publication",

            reference_id:2,

            lien: activite.titre

        })



    return activiteId

};



// Modification
const update = async (
    id,
    data,
    file
) => {


    const oldActivite =
        await repository.findById(id);



    if (!oldActivite) {

        throw new Error(
            "Activité introuvable"
        );

    }



    if (
        data.type_activite === "payant"
        &&
        (!data.montant ||
        Number(data.montant) <= 0)
    ) {

        throw new Error(
            "Le montant est obligatoire pour une activité payante"
        );

    }



    if (
        data.type_activite !== "payant"
    ) {

        data.montant = null;

    }



    let image =
        {
            url:
                oldActivite.image,

            public_id:
                oldActivite.image_public_id
        };



    // Nouvelle image
    if (file) {


        // supprimer ancienne image
        if (
            oldActivite.image_public_id
        ) {

            await deleteImage(
                oldActivite.image_public_id
            );

        }



        image =
            await uploadImage(
                file
            );

    }



    return await repository.update(
        id,
        {

            ...data,

            image:
                image.url,

            image_public_id:
                image.public_id

        }
    );

};



// Suppression
const remove = async (
    id
) => {


    const activite =
        await repository.findById(id);



    if (!activite) {

        throw new Error(
            "Activité introuvable"
        );

    }



    if (
        activite.image_public_id
    ) {

        await deleteImage(
            activite.image_public_id
        );

    }



    return await repository.remove(
        id
    );

};

const getNext = async(
    membreId
)=>{


    const activity =
        await repository.getNext(
            membreId
        );


    if(!activity){

        return null;

    }



    return {

        ...activity,

        inscrit:
            Boolean(
                activity.inscrit
            )

    };

};

/**
 * ACTIVITÉS PUBLIQUES
 */
const getPublic = async () => {

    return await repository.findPublic();

};

module.exports = {

    getAll,
    getById,
    create,
    update,
    remove,
    getNext,
    getPublic

};