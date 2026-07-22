const service =
    require('./commentaires.service');





/**
 * GET
 * /publications/:id/commentaires
 */
const getComments = async(
    req,
    res
)=>{


    try {


        const publication_id =
            req.params.id;



        const comments =
            await service.getByPublication(
                publication_id
            );



        return res.json({

            success:true,

            data:comments

        });



    }
    catch(error){


        return res.status(500)
        .json({

            success:false,

            message:
                error.message

        });


    }


};









/**
 * POST
 * /publications/:id/commentaires
 */
const createComment = async(
    req,
    res
)=>{


    try {



        const publication_id =
            req.params.id;



        const membre_id =
            req.user.id;



        const {
            contenu
        } = req.body;





        const comment =
            await service.create(

                publication_id,

                membre_id,

                contenu

            );





        return res.status(201)
        .json({

            success:true,

            message:
                "Commentaire ajouté",

            data:comment

        });




    }
    catch(error){


        return res.status(400)
        .json({

            success:false,

            message:
                error.message

        });


    }


};











/**
 * DELETE
 * /commentaires/:id
 */
const deleteComment = async(
    req,
    res
)=>{


    try {



        const id =
            req.params.id;



        await service.remove(

            id,

            req.user

        );





        return res.json({

            success:true,

            message:
                "Commentaire supprimé"

        });




    }
    catch(error){


        return res.status(403)
        .json({

            success:false,

            message:
                error.message

        });


    }


};








module.exports = {


    getComments,


    createComment,


    deleteComment


};