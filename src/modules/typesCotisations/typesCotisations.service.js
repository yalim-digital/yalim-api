const repository =
require('./typesCotisations.repository');





const getAll = async()=>{


    const types =
    await repository.findAll();


    return types.map(type=>({


        id:type.id,

        nom:type.nom,

        description:type.description,

        periodicite:type.periodicite,

        obligatoire:Boolean(
            type.obligatoire
        ),

        actif:Boolean(
            type.actif
        )


    }));

};







const getById = async(id)=>{


    const type =
    await repository.findById(id);



    if(!type){

        throw new Error(
            "Type de cotisation introuvable"
        );

    }



    return type;

};







const create = async(data)=>{


    if(
        !data.nom ||
        !data.periodicite
    ){

        throw new Error(
            "Nom et périodicité obligatoires"
        );

    }




    const id =
    await repository.create({

        nom:data.nom,

        description:
        data.description || null,

        periodicite:
        data.periodicite,

        obligatoire:
        data.obligatoire ?? true

    });



    return {

        id,

        message:
        "Type de cotisation créé"

    };


};







const update = async(id,data)=>{


    const exists =
    await repository.findById(id);



    if(!exists){

        throw new Error(
            "Type introuvable"
        );

    }



    await repository.update(
        id,
        data
    );


    return {

        message:
        "Type modifié"

    };


};







const remove = async(id)=>{


    await repository.remove(id);


    return {

        message:
        "Type désactivé"

    };


};





module.exports = {

    getAll,

    getById,

    create,

    update,

    remove

};