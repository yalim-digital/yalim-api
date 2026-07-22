const likesRepository =
    require('./likes.repository');

const publicationsRepository =
    require('../publications/publications.repository');



/**
 * Toggle Like
 */
const toggleLike = async(
    publication_id,
    membre_id
)=>{


    const publication =
        await publicationsRepository.findById(
            publication_id
        );


    if(!publication){

        throw new Error(
            'Publication introuvable'
        );

    }



    const existingLike =
        await likesRepository.findUserLike(
            publication_id,
            membre_id
        );



    let liked;



    if(existingLike){

        await likesRepository.remove(
            publication_id,
            membre_id
        );

        liked = false;

    }
    else{

        await likesRepository.create(
            publication_id,
            membre_id
        );

        liked = true;

    }



    const likes =
        await likesRepository.countByPublication(
            publication_id
        );



    return {

        liked,

        likes

    };

};





module.exports = {

    toggleLike

};