const repository =
    require('./publications.repository');


const cloudinary =
    require('../../config/cloudinary');

const uploadToCloudinary =
    require('../../utils/uploadToCloudinary');



/**
 * Liste paginée
 */
const getAll = async (
    page = 1,
    limit = 10,
    user_id
) => {


    const offset =
        (page - 1) * limit;



    const publications =
        await repository.findAll(
            Number(limit),
            Number(offset),
            user_id
        );



    const total =
        await repository.count();



    return {


        data:

            publications.map(
                (post)=>({

                    id: post.id,

                    content:
                        post.contenu,


                    image:
                        post.image,


                    createdAt:
                        post.created_at,


                    user:{

                        id:
                            post.auteur_id,

                        name:
                            post.auteur_nom,

                        avatar:
                            post.auteur_photo

                    },


                    likes: Number(post.likes),

                    liked: Boolean(post.liked),

                    commentsCount: Number(post.commentsCount),

                    comments: []


                })
            ),



        pagination:{


            page:
                Number(page),


            limit:
                Number(limit),


            total,


            pages:
                Math.ceil(
                    total / limit
                )

        }

    };


};





/**
 * Trouver par ID
 */
const getById = async(id,user_id)=>{


    const post =
        await repository.findById(
            id,user_id
        );


    if(!post){

        throw new Error(
            "Publication introuvable"
        );

    }



    return {

        id:post.id,

        content:
            post.contenu,

        image:
            post.image,


        createdAt:
            post.created_at,


        user:{

            id:
                post.auteur_id,

            name:
                post.auteur_nom,

            avatar:
                post.auteur_photo

        },
        likes: Number(post.likes),

        liked: Boolean(post.liked),

        commentsCount: Number(post.commentsCount),

        comments: []


    };


};






/**
 * Créer publication
 */
const create = async(
    data,
    file,
    userId
)=>{


    let image = null;

    let image_public_id = null;



    if(file){


        const upload =
            await uploadToCloudinary(
                file.buffer,
                "publications"
            );


        image =
            upload.secure_url;


        image_public_id =
            upload.public_id;

    }




    const id =
        await repository.create({

            contenu:
                data.contenu,


            image,


            image_public_id,


            created_by:
                userId

        });



    return {

        id,

        message:
            "Publication créée avec succès"

    };


};







/**
 * Modifier publication
 */
const update = async(
    id,
    data,
    file
)=>{


    const old =
        await repository.findById(
            id
        );


    if(!old){

        throw new Error(
            "Publication introuvable"
        );

    }



    let image =
        old.image;


    let image_public_id =
        old.image_public_id;





    if(file){



        /*
        supprimer ancienne image
        */


        if(image_public_id){


            await cloudinary
            .uploader
            .destroy(
                image_public_id
            );


        }




        const upload =
            await uploadToCloudinary(
                file.buffer,
                "publications"
            );



        image =
            upload.secure_url;



        image_public_id =
            upload.public_id;


    }





    await repository.update(

        id,

        {

            contenu:
                data.contenu,


            image,


            image_public_id

        }

    );



    return {

        message:
            "Publication modifiée"

    };


};








/**
 * Supprimer publication
 */
const remove = async(id)=>{


    const post =
        await repository.findById(
            id
        );



    if(!post){

        throw new Error(
            "Publication introuvable"
        );

    }



    if(post.image_public_id){


        await cloudinary
        .uploader
        .destroy(
            post.image_public_id
        );

    }




    await repository.remove(
        id
    );



    return {

        message:
            "Publication supprimée"

    };


};





module.exports = {

    getAll,

    getById,

    create,

    update,

    remove

};