const repository =
require('./modesPaiements.repository');








const getAll = async()=>{


    const modes =
    await repository.findAll();



    return modes.map(mode=>({


        id:mode.id,

        nom:mode.nom,

        description:
        mode.description,


        numero_compte:
        mode.numero_compte,


        titulaire:
        mode.titulaire,


        actif:
        Boolean(mode.actif)


    }));


};









const getById = async(id)=>{


    const mode =
    await repository.findById(id);



    if(!mode){

        throw new Error(
            "Mode de paiement introuvable"
        );

    }



    return mode;

};









const create = async(data)=>{


    if(!data.nom){

        throw new Error(
            "Le nom du mode de paiement est obligatoire"
        );

    }



    const id =
    await repository.create(data);



    return {


        id,

        message:
        "Mode de paiement ajouté"


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
            "Mode de paiement introuvable"
        );

    }




    await repository.update(
        id,
        data
    );



    return {

        message:
        "Mode de paiement modifié"

    };


};









const remove = async(id)=>{


    await repository.remove(id);



    return {


        message:
        "Mode de paiement désactivé"


    };


};








module.exports = {


    getAll,

    getById,

    create,

    update,

    remove

};