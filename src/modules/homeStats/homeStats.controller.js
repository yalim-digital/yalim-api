const service =
require('./homeStats.service');









/**
 * GET /home-stats
 *
 * PUBLIC
 *
 * Liste des chiffres actifs
 */
const getPublic = async(
    req,
    res
)=>{


    try{


        const result =
            await service.getPublic();



        res.json({

            data:
                result

        });



    }
    catch(error){


        res.status(500).json({

            message:
                error.message

        });


    }


};









/**
 * GET /home-stats/admin
 *
 * ADMIN
 *
 * Tous les chiffres
 */
const getAll = async(
    req,
    res
)=>{


    try{


        const result =
            await service.getAll();



        res.json({

            data:
                result

        });



    }
    catch(error){


        res.status(500).json({

            message:
                error.message

        });


    }


};









/**
 * GET /home-stats/:id
 *
 * ADMIN
 */
const getById = async(
    req,
    res
)=>{


    try{


        const result =
            await service.getById(

                req.params.id

            );



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
 * POST /home-stats
 *
 * ADMIN
 */
const create = async(
    req,
    res
)=>{


    try{


        const result =
            await service.create(

                req.body

            );



        res.status(201)
            .json(result);



    }
    catch(error){


        res.status(400).json({

            message:
                error.message

        });


    }


};









/**
 * PUT /home-stats/:id
 *
 * ADMIN
 */
const update = async(
    req,
    res
)=>{


    try{


        const result =
            await service.update(

                req.params.id,

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









/**
 * DELETE /home-stats/:id
 *
 * ADMIN
 */
const remove = async(
    req,
    res
)=>{


    try{


        const result =
            await service.remove(

                req.params.id

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


    getPublic,


    getAll,


    getById,


    create,


    update,


    remove


};