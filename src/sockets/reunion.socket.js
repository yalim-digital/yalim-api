let io;

const init = (server) => {
    const { Server } = require('socket.io');

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on('connection', (socket) => {

        console.log('Utilisateur connecté', socket.id);

        // 👇 join room réunion
        socket.on('rejoindre_reunion', (data) => {
            socket.join(data.reunion_id);

            io.to(data.reunion_id).emit(
                'utilisateur_rejoint',
                data
            );
        });

        // 👇 room admin (IMPORTANT pour ton cas)
            socket.on('join_admin', () => {

                socket.join('admin_room');

                console.log(
                    `Admin ${socket.id} rejoint admin_room`
                );

            });

            socket.on('join_member', (userId) => {

                socket.join(`member_${userId}`);

                console.log(
                    `Membre ${userId} rejoint member_${userId}`
                );

            });

    });

    io.on('disconnect', () => {
        console.log('Utilisateur déconnecté', socket.id);
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
};

module.exports = {
    init,
    getIO
};