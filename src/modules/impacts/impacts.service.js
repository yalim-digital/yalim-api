const repository =
require('./impacts.repository');









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


    const impact =
        await repository.findById(
            id
        );



    if(!impact){


        throw new Error(
            "Impact introuvable"
        );


    }



    return impact;


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
            "Impact créé avec succès"

    };


};









/**
 * UPDATE
 */
const update = async(
    id,
    data
)=>{


    const impact =
        await repository.findById(
            id
        );



    if(!impact){


        throw new Error(
            "Impact introuvable"
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
            "Impact modifié avec succès"


    };


};









/**
 * DELETE
 */
const remove = async(
    id
)=>{


    const impact =
        await repository.findById(
            id
        );



    if(!impact){


        throw new Error(
            "Impact introuvable"
        );

    }





    await repository.remove(
        id
    );






    return {


        message:
            "Impact supprimé avec succès"


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