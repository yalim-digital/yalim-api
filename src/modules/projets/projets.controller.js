const service =
require('./projets.service');









/**
 * GET /projets
 *
 * PUBLIC
 */
const getPublic = async(req, res)=>{


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
 * GET /projets/admin
 *
 * ADMIN
 */
const getAll = async(req, res)=>{


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
 * GET /projets/:id
 *
 * ADMIN
 */
const getById = async(req, res)=>{


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
 * POST /projets
 *
 * ADMIN
 *
 * multipart/form-data
 * file: image
 */
const create = async(req, res)=>{


    try{


        const result =
            await service.create(

                req.body,

                req.file

            );



        res.status(201).json(result);



    }
    catch(error){


        res.status(400).json({

            message:
                error.message

        });


    }


};









/**
 * PUT /projets/:id
 *
 * ADMIN
 */
const update = async(req, res)=>{


    try{


        const result =
            await service.update(

                req.params.id,

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









/**
 * DELETE /projets/:id
 *
 * ADMIN
 */
const remove = async(req, res)=>{


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