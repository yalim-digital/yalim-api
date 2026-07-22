const likesService =
    require('./likes.service');





/**
 * POST
 * /publications/:id/like
 *
 * Ajouter ou retirer un like
 */
const toggleLike = async(
    req,
    res
)=>{


    try {


        const publication_id =
            req.params.id;



        const membre_id =
            req.params.membreId;




        const result =
            await likesService.toggleLike(

                publication_id,

                membre_id

            );





        return res.json({

            success:true,

            data:result

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






module.exports = {

    toggleLike

};