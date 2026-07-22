const repository =
require('./timeline.repository');









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
const getById = async(
    id
)=>{


    const timeline =
        await repository.findById(
            id
        );



    if(!timeline){


        throw new Error(
            "Élément timeline introuvable"
        );


    }



    return timeline;


};









/**
 * CREATE
 */
const create = async(
    data
)=>{


    /**
     * Validation métier
     */
    if(

        !data.titre

        ||

        !data.description

    ){


        throw new Error(

            "Le titre et la description sont obligatoires"

        );


    }







    const id =
        await repository.create({

            icone:
                data.icone || null,


            titre:
                data.titre,


            description:
                data.description,


            ordre:
                data.ordre || 0,


            actif:
                data.actif ?? 1

        });







    return {

        id,

        message:
            "Élément timeline créé avec succès"

    };


};









/**
 * UPDATE
 */
const update = async(
    id,
    data
)=>{


    const timeline =
        await repository.findById(
            id
        );



    if(!timeline){


        throw new Error(

            "Élément timeline introuvable"

        );


    }







    await repository.update(

        id,

        {

            ...data

        }

    );






    return {


        message:
            "Élément timeline modifié avec succès"


    };


};









/**
 * DELETE
 */
const remove = async(
    id
)=>{


    const timeline =
        await repository.findById(
            id
        );



    if(!timeline){


        throw new Error(

            "Élément timeline introuvable"

        );


    }







    await repository.remove(
        id
    );






    return {


        message:
            "Élément timeline supprimé avec succès"


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