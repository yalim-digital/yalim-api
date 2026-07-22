const repository =
    require('./commentaires.repository');


const publicationsRepository =
    require('../publications/publications.repository');





/**
 * Formatter commentaire frontend
 */
const formatComment = (
    comment
) => {


    return {

        id: comment.id,


        contenu:
            comment.contenu,


        createdAt:
            comment.created_at,



        user:{

            id:
                comment.auteur_id,


            name:
                comment.auteur_nom,


            avatar:
                comment.auteur_photo

        }

    };

};









/**
 * Récupérer commentaires publication
 */
const getByPublication = async(
    publication_id
)=>{


    const comments =
        await repository.findByPublication(
            publication_id
        );



    return comments.map(
        formatComment
    );


};









/**
 * Ajouter commentaire
 */
const create = async(
    publication_id,
    membre_id,
    contenu
)=>{


    // Vérifier publication existe

    const publication =
        await publicationsRepository.findById(
            publication_id
        );



    if(!publication){

        throw new Error(
            "Publication introuvable"
        );

    }






    if(
        !contenu ||
        contenu.trim().length === 0
    ){

        throw new Error(
            "Le commentaire est obligatoire"
        );

    }






    const id =
        await repository.create({

            publication_id,

            membre_id,

            contenu:
                contenu.trim()

        });





    const comment =
        await repository.findById(
            id
        );



    return formatComment(
        comment
    );

};









/**
 * Supprimer commentaire
 */
const remove = async(
    commentaire_id,
    user
)=>{


    const comment =
        await repository.findById(
            commentaire_id
        );



    if(!comment){

        throw new Error(
            "Commentaire introuvable"
        );

    }






    /**
     * Seul :
     * - auteur du commentaire
     * - admin
     * peut supprimer
     */

    if(
        comment.membre_id !== user.id
        &&
        user.role !== "admin"
    ){

        throw new Error(
            "Vous ne pouvez pas supprimer ce commentaire"
        );

    }





    await repository.remove(
        commentaire_id
    );



    return true;


};







module.exports = {


    getByPublication,


    create,


    remove


};