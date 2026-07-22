const repository =
require('./projets.repository');



const cloudinary =
require('../../config/cloudinary');



const uploadToCloudinary =
require('../../utils/uploadToCloudinary');









/**
 * LISTE ADMIN
 */
const getAll = async()=>{


    return await repository.findAll();


};









/**
 * LISTE PUBLIC
 */
const getPublic = async()=>{


    return await repository.findPublic();


};









/**
 * GET ONE
 */
const getById = async(id)=>{


    const projet =
        await repository.findById(id);



    if(!projet){


        throw new Error(
            "Projet introuvable"
        );


    }



    return projet;


};









/**
 * UPLOAD IMAGE
 */
const uploadImage = async(file)=>{


    if(!file){

        return null;

    }



    const result =
        await uploadToCloudinary(

            file.buffer,

            "projets"

        );



    return {

        url:
            result.secure_url,

        public_id:
            result.public_id

    };


};









/**
 * DELETE IMAGE
 */
const deleteImage = async(public_id)=>{


    if(!public_id){

        return;

    }



    await cloudinary
        .uploader
        .destroy(public_id);


};









/**
 * CREATE
 */
const create = async(data, file)=>{


    /**
     * Validation métier
     */
    if(!data.titre){


        throw new Error(
            "Le titre est obligatoire"
        );


    }







    /**
     * Upload image
     */
    const image =
        await uploadImage(file);







    const id =
        await repository.create({

            categorie:
                data.categorie || null,

            titre:
                data.titre,

            description:
                data.description || null,

            statut:
                data.statut || "en_cours",

            mise_en_avant:
                data.mise_en_avant ?? 0,

            ordre:
                data.ordre || 0,

            actif:
                data.actif ?? 1,

            image:
                image?.url || null,

            image_public_id:
                image?.public_id || null

        });







    return {

        id,

        message:
            "Projet créé avec succès"

    };


};









/**
 * UPDATE
 */
const update = async(id, data, file)=>{


    const projet =
        await repository.findById(id);



    if(!projet){


        throw new Error(
            "Projet introuvable"
        );


    }







    let image =
        {

            url:
                projet.image,

            public_id:
                projet.image_public_id

        };







    /**
     * Nouvelle image
     */
    if(file){


        if(projet.image_public_id){


            await deleteImage(
                projet.image_public_id
            );


        }



        const newImage =
            await uploadImage(file);



        image =
            newImage;

    }







    await repository.update(

        id,

        {

            ...data,

            image:
                image.url,

            image_public_id:
                image.public_id

        }

    );







    return {

        message:
            "Projet modifié avec succès"

    };


};









/**
 * DELETE
 */
const remove = async(id)=>{


    const projet =
        await repository.findById(id);



    if(!projet){


        throw new Error(
            "Projet introuvable"
        );


    }







    if(projet.image_public_id){


        await deleteImage(
            projet.image_public_id
        );


    }







    await repository.remove(id);



    return {

        message:
            "Projet supprimé avec succès"

    };


};









module.exports = {

    getAll,
    getPublic,
    getById,
    create,
    update,
    remove

};