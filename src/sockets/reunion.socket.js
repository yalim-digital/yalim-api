let io;


const init = (server) => {

    const { Server } = require('socket.io');


    io = new Server(server, {

        cors: {
            origin: "*"
        }

    });



    io.on('connection', (socket) => {


        console.log(
            'Utilisateur connecté',
            socket.id
        );



        // ======================
        // ROOM REUNION
        // ======================

        socket.on(
            'rejoindre_reunion',
            (data) => {


                socket.join(
                    data.reunion_id
                );


                io.to(
                    data.reunion_id
                )
                .emit(
                    'utilisateur_rejoint',
                    data
                );


            }
        );



        // ======================
        // ROOM ADMIN
        // ======================


        socket.on(
            'join_admin',
            () => {


                socket.join(
                    'admin_room'
                );


                console.log(
                    `Admin ${socket.id} rejoint admin_room`
                );


            }
        );





        // ======================
        // ROOM MEMBER
        // ======================


       socket.on('join_member', (userId) => {

            socket.join(`member_${userId}`);

            console.log(
                `Membre ${userId} rejoint member_${userId}`
            );


            console.log(
                "Rooms du socket :",
                socket.rooms
            );

        });






        // ======================
        // DISCONNECT
        // ======================


        socket.on(
            'disconnect',
            ()=>{


                console.log(
                    'Utilisateur déconnecté',
                    socket.id
                );


            }
        );



    });



    return io;

};





const getIO = ()=>{


    if(!io){

        throw new Error(
            "Socket not initialized"
        );

    }


    return io;

};





module.exports={
    init,
    getIO
};