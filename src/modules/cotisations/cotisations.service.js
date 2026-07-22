const repository =
require('./cotisations.repository');


const typesRepository =
require('../typesCotisations/typesCotisations.repository');







const getAll = async()=>{


    return await repository.findAll();

};







const getAvailable = async()=>{


    return await repository.findAvailable();

};







const getById = async(id)=>{


    const cotisation =
    await repository.findById(id);



    if(!cotisation){

        throw new Error(
            "Cotisation introuvable"
        );

    }



    return cotisation;

};








const create = async(
    data,
    userId
)=>{


    const type =
    await typesRepository.findById(
        data.type_cotisation_id
    );



    if(!type){

        throw new Error(
            "Type de cotisation invalide"
        );

    }




    if(
        !data.montant ||
        data.montant <= 0
    ){

        throw new Error(
            "Montant invalide"
        );

    }





    const id =
    await repository.create({

        ...data,

        statut:
        data.statut || "ouverte",

        created_by:
        userId

    });




    return {

        id,

        message:
        "Cotisation créée"

    };


};







const update = async(
    id,
    data
)=>{


    const exists =
    await repository.findById(id);



    if(!exists){

        throw new Error(
            "Cotisation introuvable"
        );

    }



    await repository.update(
        id,
        data
    );


    return {

        message:
        "Cotisation modifiée"

    };


};







const remove = async(id)=>{


    await repository.remove(id);



    return {

        message:
        "Cotisation archivée"

    };

};







module.exports = {


    getAll,

    getAvailable,

    getById,

    create,

    update,

    remove


};