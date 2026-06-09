require('dotenv').config();

const http = require('http');

const app = require('./app');

const server = http.createServer(app);

const socket = require('./sockets/reunion.socket');



socket.init(server);

server.listen(process.env.PORT, () => {

    console.log(
        `Serveur lancé sur le port ${process.env.PORT}`
    );

});