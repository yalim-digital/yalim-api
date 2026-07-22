const service =
require('./typesCotisations.service');





/**
 * GET /types-cotisations
 */
const getAll = async(req,res)=>{


    try {


        const data =
        await service.getAll();



        res.json({

            success:true,

            data

        });


    }
    catch(error){


        console.error(error);


        res.status(500).json({

            success:false,

            message:
            error.message

        });


    }


};







/**
 * GET /types-cotisations/:id
 */
const getById = async(req,res)=>{


    try {


        const data =
        await service.getById(
            req.params.id
        );



        res.json({

            success:true,

            data

        });


    }
    catch(error){


        res.status(404).json({

            success:false,

            message:
            error.message

        });


    }


};









/**
 * POST /types-cotisations
 */
const create = async(req,res)=>{


    try {


        const result =
        await service.create(
            req.body
        );



        res.status(201).json({

            success:true,

            data:result

        });


    }
    catch(error){


        console.error(error);


        res.status(400).json({

            success:false,

            message:
            error.message

        });


    }


};









/**
 * PUT /types-cotisations/:id
 */
const update = async(req,res)=>{


    try {


        const result =
        await service.update(

            req.params.id,

            req.body

        );



        res.json({

            success:true,

            data:result

        });


    }
    catch(error){


        res.status(400).json({

            success:false,

            message:
            error.message

        });


    }


};









/**
 * DELETE /types-cotisations/:id
 */
const remove = async(req,res)=>{


    try {


        const result =
        await service.remove(
            req.params.id
        );



        res.json({

            success:true,

            data:result

        });


    }
    catch(error){


        res.status(400).json({

            success:false,

            message:
            error.message

        });


    }


};







module.exports = {


    getAll,

    getById,

    create,

    update,

    remove


};