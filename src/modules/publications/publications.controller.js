const service =
    require('./publications.service');



/**
 * GET /publications?page=1&limit=10
 */
const getAll = async(
    req,
    res
) => {


    try {


        const {
            page = 1,
            limit = 10
        } = req.query;



        const result =
            await service.getAll(
                page,
                limit,
                req.user.id
            );



        res.json(
            result
        );



    } catch(error){


        res.status(500)
        .json({

            message:
                error.message

        });


    }

};







/**
 * GET /publications/:id
 */
const getById = async(
    req,
    res
) => {


    try {


        const publication =
            await service.getById(
                req.params.id,req.user.id
            );



        res.json(
            publication
        );



    } catch(error){


        res.status(404)
        .json({

            message:
                error.message

        });


    }

};









/**
 * POST /publications
 */
const create = async(
    req,
    res
) => {


    try {



        const result =
            await service.create(

                req.body,

                req.file,

                req.user.id

            );



        res.status(201)
        .json(
            result
        );



    } catch(error){



        res.status(400)
        .json({

            message:
                error.message

        });


    }


};









/**
 * PUT /publications/:id
 */
const update = async(
    req,
    res
) => {


    try {


        const result =
            await service.update(

                req.params.id,

                req.body,

                req.file

            );



        res.json(
            result
        );



    }catch(error){



        res.status(400)
        .json({

            message:
                error.message

        });


    }


};









/**
 * DELETE /publications/:id
 */
const remove = async(
    req,
    res
) => {


    try {



        const result =
            await service.remove(
                req.params.id
            );



        res.json(
            result
        );



    }catch(error){



        res.status(400)
        .json({

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