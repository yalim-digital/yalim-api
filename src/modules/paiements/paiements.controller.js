const service =
require('./paiements.service');





/**
 * GET /paiements
 * ADMIN
 *
 * Query :
 * page
 * limit
 * recherche
 * statut
 * mode_paiement_id
 * date_debut
 * date_fin
 */
const getAll = async(req,res)=>{


    try{


        const {

            page = 1,

            limit = 10,

            recherche = "",

            statut = "",

            mode_paiement_id = "",

            date_debut = "",

            date_fin = ""


        } = req.query;





        const offset =
            (Number(page)-1)
            *
            Number(limit);







        const result =
            await service.getAll({

                recherche,

                statut,

                mode_paiement_id,

                date_debut,

                date_fin,

                limit,

                offset

            });








        res.json(result);





    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};









/**
 * GET /paiements/mes-paiements
 * MEMBRE
 */
const getMyPayments = async(
    req,
    res
)=>{


    try{


        const result =
            await service.getByMembre(
                req.user.id
            );



        res.json({

            data: result

        });


    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};









/**
 * GET /paiements/:id
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

            data:result

        });


    }
    catch(error){


        res.status(404).json({

            message:error.message

        });


    }


};









/**
 * POST /paiements
 * MEMBRE
 *
 * multipart/form-data
 *
 * preuve = image
 */
const create = async(
    req,
    res
)=>{


    try{


        const result =
            await service.create(

                req.body,

                req.file,

                req.user.id

            );



        res.status(201).json(result);



    }
    catch(error){


        res.status(400).json({

            message:error.message

        });


    }


};









/**
 * PUT /paiements/:id/valider
 * ADMIN
 */
const validate = async(
    req,
    res
)=>{


    try{


        const result =
            await service.validate(

                req.params.id,

                req.user.id

            );



        res.json(result);



    }
    catch(error){


        res.status(400).json({

            message:error.message

        });


    }


};









/**
 * PUT /paiements/:id/refuser
 * ADMIN
 */
const refuse = async(
    req,
    res
)=>{


    try{

       

        const result =
            await service.refuse(

                req.params.id,

                req.user.id,

                req.body.commentaire.commentaire_admin

            );



        res.json(result);



    }
    catch(error){


        res.status(400).json({

            message:error.message

        });


    }


};









module.exports = {


    getAll,


    getMyPayments,


    getById,


    create,


    validate,


    refuse


};