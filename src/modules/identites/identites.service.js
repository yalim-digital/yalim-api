const repository =
require('./identites.repository');









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


    const identite =
        await repository.findById(
            id
        );



    if(!identite){


        throw new Error(

            "Identité introuvable"

        );


    }



    return identite;


};









/**
 * CREATE
 */
const create = async(
    data
)=>{


    /**
     * Validation obligatoire
     */
    if(

        !data.type

        ||

        !data.contenu

    ){


        throw new Error(

            "Le type et le contenu sont obligatoires"

        );


    }









    /**
     * Types autorisés
     */
    const typesAutorises = [

        "Mission",

        "Vision",
        "Valeurs"

    ];








    if(

        !typesAutorises.includes(
            data.type
        )

    ){


        throw new Error(

            "Type d'identité invalide"

        );


    }









    const id =
        await repository.create({

            type:
                data.type,


            contenu:
                data.contenu,


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
            "Identité créée avec succès"


    };


};









/**
 * UPDATE
 */
const update = async(
    id,
    data
)=>{


    const identite =
        await repository.findById(
            id
        );



    if(!identite){


        throw new Error(

            "Identité introuvable"

        );


    }








    if(data.type){


        const typesAutorises = [

                  "Mission",

        "Vision",
        "Valeurs"

        ];





        if(

            !typesAutorises.includes(
                data.type
            )

        ){


            throw new Error(

                "Type d'identité invalide"

            );


        }


    }









    await repository.update(

        id,

        {

            ...data

        }

    );







    return {


        message:
            "Identité modifiée avec succès"


    };


};









/**
 * DELETE
 */
const remove = async(
    id
)=>{


    const identite =
        await repository.findById(
            id
        );



    if(!identite){


        throw new Error(

            "Identité introuvable"

        );


    }







    await repository.remove(
        id
    );







    return {


        message:
            "Identité supprimée avec succès"


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