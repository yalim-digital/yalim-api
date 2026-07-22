const service =
    require('./participations.service');

const participate = async (
    req,
    res,
    next
) => {


    try {

        const result =
            await service.participate(

                req.user.id,

                req.params.activiteId,

                req.body

            );

        res.status(201)
            .json(result);

    } catch(error){

        next(error);

    }

};

const cancelParticipation = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await service.cancelParticipation(
                req.user.id,
                req.params.activiteId
            );

        res.json(result);

    } catch (error) {

        next(error);

    }

};

const getMyParticipations = async (
    req,
    res,
    next
) => {

    const page =
    req.query.page || 1;


    const limit =
        req.query.limit || 5;



    try {

        const result =
            await service.getMyParticipations(
                req.user.id,
                page,
                limit
            );


        res.json(result);

    } catch (error) {

        next(error);

    }

};

const getParticipantsAdmin = async(
    req,
    res,
    next
    )=>{


    try{


    const result =
    await service.getParticipantsAdmin(
        req.params.activiteId
    );


    res.json(result);


    }catch(error){

    next(error);

    }


};

const validateParticipation = async(
    req,
    res,
    next
    )=>{


    try{


    const result =
    await service.validateParticipation(

        req.params.id,

        req.user.id,

        req.body.montant_valide

    );


    res.json(result);


    }catch(error){

    next(error);

    }

};

const present = async(
    req,res,next
    )=>{


    try{


    const result =
    await service.markPresent(
        req.params.id
    );


    res.json(result);


    }catch(error){

    next(error);

    }


};
const absent = async(
    req,res,next
    )=>{


    try{


    const result =
    await service.markAbsent(
        req.params.id
    );


    res.json(result);


    }catch(error){

    next(error);

    }


};
const getMyPreview = async (
    req,
    res,
    next
) => {

    try {

        const data =
            await service.getMyPreview(
                req.params.id
            );

        res.json(data);

    } catch(error){

        next(error);

    }

};
const myIds = async(req,res)=>{


    const ids =
    await service.getMyParticipationIds(
        req.user.id
    );


    res.json(ids);

};

const getQRCode = async(
req,
res,
next
)=>{


try{


const result =
await service.getQRCode(
    req.user.id,
    req.params.id
);


res.json(result);


}catch(error){

next(error);

}


};

const checkin = async(
    req,
    res,
    next
)=>{


try{


const result =
await service.checkin(

    req.body.qr_token,

    req.user.id

);


res.json(result);


}catch(error){

next(error);

}


};

const scanPreview = async(
    req,
    res,
    next
)=>{


try{


const result =
await service.scanPreview(

    req.body.qr_token,

    req.user.id

);


res.json(result);


}catch(error){

next(error);

}


};

module.exports = {
    participate,
    cancelParticipation,
    getMyParticipations,
    getParticipantsAdmin,
    validateParticipation,
    present,
    absent,
    getMyPreview,
    myIds,
    getQRCode,
    checkin,
    scanPreview
};