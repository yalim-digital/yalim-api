const repository =
require('./homeHistoire.repository');




/**
 * GET HISTOIRE
 *
 * Public
 */
const get = async()=>{


    const histoire =
        await repository.find();




    // if(!histoire){


    //     throw new Error(
    //         "Histoire introuvable"
    //     );


    // }





    return histoire;


};








/**
 * UPDATE HISTOIRE
 *
 * Admin
 */
const update = async(
    data
)=>{


    let histoire =
        await repository.find();






    /**
     * Si aucune donnée existe
     */
    if(!histoire){


        const histoireData = {


            ...data,


            actif:
                data.actif ?? 1


        };






        const id =
            await repository.create(

                histoireData

            );







        return {


            id,


            message:
                "Histoire créée avec succès"


        };


    }









    /**
     * Validation
     */
    if(
        !data.titre
    ){

        throw new Error(

            "Le titre est obligatoire"

        );

    }








    let updateData = {


        ...data


    };




    await repository.update(

        histoire.id,

        updateData

    );







    return {


        message:
            "Histoire modifiée avec succès"


    };


};









module.exports = {


    get,


    update


};