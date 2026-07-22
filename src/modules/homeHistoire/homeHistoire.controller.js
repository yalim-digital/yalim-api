const service =
require('./homeHistoire.service');









/**
 * GET /home-histoire
 *
 * PUBLIC
 *
 * Récupérer l'histoire
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
 * PUT /home-histoire
 *
 * ADMIN
 *
 */
const update = async(
    req,
    res
)=>{


    try{


        const result =
            await service.update(

                req.body

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