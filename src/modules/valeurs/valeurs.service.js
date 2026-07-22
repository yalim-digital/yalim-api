const repository =
require('./valeurs.repository');









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


    const valeur =
        await repository.findById(
            id
        );



    if(!valeur){


        throw new Error(
            "Valeur introuvable"
        );


    }



    return valeur;


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
    if(!data.nom){


        throw new Error(
            "Le nom est obligatoire"
        );


    }







    const id =
        await repository.create({

            nom:
                data.nom,

            description:
                data.description || null,

            icone:
                data.icone || null,

            ordre:
                data.ordre || 0,

            actif:
                data.actif ?? 1

        });







    return {

        id,

        message:
            "Valeur créée avec succès"

    };


};









/**
 * UPDATE
 */
const update = async(
    id,
    data
)=>{


    const valeur =
        await repository.findById(
            id
        );



    if(!valeur){


        throw new Error(
            "Valeur introuvable"
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
            "Valeur modifiée avec succès"

    };


};









/**
 * DELETE
 */
const remove = async(
    id
)=>{


    const valeur =
        await repository.findById(
            id
        );



    if(!valeur){


        throw new Error(
            "Valeur introuvable"
        );


    }







    await repository.remove(
        id
    );







    return {

        message:
            "Valeur supprimée avec succès"

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