const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");


const generateParticipationQRCode = async(
    participationId
)=>{


    const token =
        uuidv4();


    const data = JSON.stringify({

        participationId,

        token,

        type:"ACTIVITY_CHECKIN"

    });



    const qr =
        await QRCode.toDataURL(
            data
        );


    return {

        token,

        qr

    };


};

const crypto = require("crypto");


const generateToken = ()=>{

    return crypto
        .randomBytes(32)
        .toString("hex");

};




module.exports = {
    generateParticipationQRCode,
    generateToken
};