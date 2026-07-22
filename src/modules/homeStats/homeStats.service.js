const repository =
require('./homeStats.repository');









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


    const stat =
        await repository.findById(
            id
        );



    if(!stat){


        throw new Error(
            "Chiffre clé introuvable"
        );


    }



    return stat;


};









/**
 * CREATE
 */
const create = async(
    data
)=>{


    /**
     * Validation
     */
    if(
        !data.valeur
        ||
        !data.texte
    ){

        throw new Error(
            "La valeur et le texte sont obligatoires"
        );

    }







    const id =
        await repository.create({

            icone:
                data.icone || null,


            valeur:
                data.valeur,


            texte:
                data.texte,


            ordre:
                data.ordre || 0,


            actif:
                data.actif ?? 1

        });






    return {

        id,

        message:
            "Chiffre clé créé avec succès"

    };


};









/**
 * UPDATE
 */
const update = async(
    id,
    data
)=>{


    const stat =
        await repository.findById(
            id
        );



    if(!stat){


        throw new Error(
            "Chiffre clé introuvable"
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
            "Chiffre clé modifié avec succès"


    };


};









/**
 * DELETE
 */
const remove = async(
    id
)=>{


    const stat =
        await repository.findById(
            id
        );



    if(!stat){


        throw new Error(
            "Chiffre clé introuvable"
        );

    }





    await repository.remove(
        id
    );






    return {


        message:
            "Chiffre clé supprimé avec succès"


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