const service =
    require('./activites.service');


// GET /api/activites
const getAll = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await service.getAll();


        res.json(result);


    } catch (error) {

        next(error);

    }

};



// GET /api/activites/:id
const getById = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await service.getById(
                req.params.id
            );


        res.json(result);


    } catch (error) {

        next(error);

    }

};



// POST /api/activites
const create = async (
    req,
    res,
    next
) => {

    try {


        const data = {
            ...req.body
        };


        const result =
            await service.create(
                data,
                req.file,
                req.user.id
            );


        res.status(201)
            .json({
                message:
                    "Activité créée avec succès",

                id:
                    result
            });



    } catch (error) {

        next(error);

    }

};



// PUT /api/activites/:id
const update = async (
    req,
    res,
    next
) => {

    try {


        const data = {
            ...req.body
        };


        await service.update(
            req.params.id,
            data,
            req.file
        );


        res.json({
            message:
                "Activité modifiée avec succès"
        });



    } catch (error) {

        next(error);

    }

};



// DELETE /api/activites/:id
const remove = async (
    req,
    res,
    next
) => {

    try {


        await service.remove(
            req.params.id
        );


        res.json({
            message:
                "Activité supprimée avec succès"
        });



    } catch (error) {

        next(error);

    }

};

const getNext = async(
    req,
    res,
    next
)=>{


    try {

      
        const activity =
            await service.getNext(
                req.params.memberId
            );


        res.json(
            activity
        );


    } catch(error){

        next(error);

    }

};

/**
 * GET /activities/public
 */
const getPublic = async (req, res) => {

    try {

        const activities =
            await service.getPublic();

        res.json({

            success: true,

            data: activities

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {

    getAll,
    getById,
    create,
    update,
    remove,
    getNext,
    getPublic

};