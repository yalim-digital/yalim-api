const repository =
require('./homeHero.repository');



const cloudinary =
    require('../../config/cloudinary');


const uploadToCloudinary =
    require('../../utils/uploadToCloudinary');








/**
 * GET HERO
 * Public
 */
const get = async()=>{


    const hero =
        await repository.find();



    if(!hero){

        throw new Error(
            "Hero introuvable"
        );

    }



    return hero;


};









/**
 * Upload image Cloudinary
 */
const uploadImage = async(
    file
)=>{


    if(!file){

        return null;

    }





    const upload =
        await uploadToCloudinary(

            file.buffer,

            "home_hero"

        );




    return {

        url:
            upload.secure_url,


        public_id:
            upload.public_id

    };


};









/**
 * Supprimer image Cloudinary
 */
const deleteImage = async(
    public_id
)=>{


    if(!public_id){

        return;

    }




    await cloudinary
        .uploader
        .destroy(

            public_id

        );


};









/**
 * CREATE / UPDATE HERO
 *
 * Admin
 */
const update = async(
    data,
    file
)=>{


    let hero =
        await repository.find();





    /**
     * Si aucun Hero existe
     */
    if(!hero){



        let image = null;



        if(file){


            image =
                await uploadImage(
                    file
                );


        }






        const heroData = {


            ...data,


            image:
                image?.url || null,


            image_public_id:
                image?.public_id || null,


            actif:
                data.actif ?? 1


        };






        if(
            heroData.boutons
            &&
            typeof heroData.boutons !== "string"
        ){

            heroData.boutons =
                JSON.stringify(
                    heroData.boutons
                );

        }







        const id =
            await repository.create(
                heroData
            );





        return {

            id,

            message:
                "Hero créé avec succès"

        };


    }










    /**
     * Mise à jour existant
     */
    let updateData = {


        ...data


    };









    /**
     * Gestion JSON boutons
     */
    if(
        updateData.boutons
        &&
        typeof updateData.boutons !== "string"
    ){

        updateData.boutons =
            JSON.stringify(
                updateData.boutons
            );

    }









    /**
     * Nouvelle image
     */
    if(file){



        if(
            hero.image_public_id
        ){


            await deleteImage(

                hero.image_public_id

            );


        }







        const image =
            await uploadImage(
                file
            );






        updateData.image =
            image.url;



        updateData.image_public_id =
            image.public_id;


    }








    await repository.update(

        hero.id,

        updateData

    );





    return {


        message:
            "Hero mis à jour avec succès"


    };


};









module.exports = {


    get,


    update


};