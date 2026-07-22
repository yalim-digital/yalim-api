const repository =
require('./documentsPublics.repository');



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


    const doc =
        await repository.findById(id);



    if(!doc){


        throw new Error(
            "Document introuvable"
        );


    }



    return doc;


};









/**
 * UPLOAD FICHIER
 */
const uploadFile = async(file)=>{


    if(!file){

        return null;

    }



    const result =
        await uploadToCloudinary(

            file.buffer,

            "documents_publics"

        );



    return {

        url:
            result.secure_url,

        public_id:
            result.public_id,

        size:
            file.size,

        type:
            file.mimetype

    };


};









/**
 * DELETE FILE
 */
const deleteFile = async(public_id)=>{


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
     * Upload fichier
     */
    const fichier =
        await uploadFile(file);







    if(!fichier){


        throw new Error(
            "Le fichier est obligatoire"
        );


    }







    const id =
        await repository.create({

            titre:
                data.titre,

            description:
                data.description || null,

            fichier_url:
                fichier.url,

            fichier_public_id:
                fichier.public_id,

            type_fichier:
                fichier.type,

            taille:
                fichier.size,

            categorie:
                data.categorie || null,

            ordre:
                data.ordre || 0,

            actif:
                data.actif ?? 1

        });







    return {

        id,

        message:
            "Document créé avec succès"

    };


};









/**
 * UPDATE
 */
const update = async(id, data, file)=>{


    const doc =
        await repository.findById(id);



    if(!doc){


        throw new Error(
            "Document introuvable"
        );


    }







    let fichier =
        {

            url:
                doc.fichier_url,

            public_id:
                doc.fichier_public_id

        };







    /**
     * Nouveau fichier
     */
    if(file){


        if(doc.fichier_public_id){


            await deleteFile(doc.fichier_public_id);


        }



        const newFile =
            await uploadFile(file);



        fichier = newFile;

    }







    await repository.update(

        id,

        {

            ...data,

            fichier_url:
                fichier.url,

            fichier_public_id:
                fichier.public_id

        }

    );







    return {

        message:
            "Document modifié avec succès"

    };


};









/**
 * DELETE
 */
const remove = async(id)=>{


    const doc =
        await repository.findById(id);



    if(!doc){


        throw new Error(
            "Document introuvable"
        );


    }







    if(doc.fichier_public_id){


        await deleteFile(doc.fichier_public_id);


    }







    await repository.remove(id);



    return {

        message:
            "Document supprimé avec succès"

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