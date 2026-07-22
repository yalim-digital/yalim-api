const repository =
require('./domainesActions.repository');



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


    const domaine =
        await repository.findById(
            id
        );



    if(!domaine){


        throw new Error(
            "Domaine d'action introuvable"
        );


    }



    return domaine;


};







/**
 * CREATE
 */
const create = async(
    data,
    file
)=>{


    /**
     * Validation métier
     */
    if(
        !data.nom
        ||
        !data.description
    ){


        throw new Error(
            "Le nom et la description sont obligatoires"
        );


    }




    const id =
        await repository.create({

            nom:
                data.nom,

            description:
                data.description,

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
            "Domaine d'action créé avec succès"

    };


};









/**
 * UPDATE
 */
const update = async(
    id,
    data,
    file
)=>{


    const domaine =
        await repository.findById(
            id
        );



    if(!domaine){


        throw new Error(
            "Domaine d'action introuvable"
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
            "Domaine d'action modifié avec succès"

    };


};









/**
 * DELETE
 */
const remove = async(
    id
)=>{


    const domaine =
        await repository.findById(
            id
        );



    if(!domaine){


        throw new Error(
            "Domaine d'action introuvable"
        );


    }



    await repository.remove(
        id
    );







    return {

        message:
            "Domaine d'action supprimé avec succès"

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