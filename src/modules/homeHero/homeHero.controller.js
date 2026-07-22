const service =
require('./homeHero.service');









/**
 * GET /home-hero
 *
 * Récupérer le hero public
 */
const get = async(
    req,
    res
)=>{


    try{


        const result =
            await service.get();



        res.json({

            data:
                result

        });



    }
    catch(error){


        res.status(404).json({

            message:
                error.message

        });


    }


};









/**
 * PUT /home-hero
 *
 * ADMIN
 *
 * multipart/form-data
 *
 * image : fichier image
 */
const update = async(
    req,
    res
)=>{


    try{


        const result =
            await service.update(

                req.body,

                req.file

            );




        res.json(result);



    }
    catch(error){


        res.status(400).json({

            message:
                error.message

        });


    }


};









module.exports = {


    get,


    update


};