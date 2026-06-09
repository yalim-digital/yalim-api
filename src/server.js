require('dotenv').config();

const http = require('http');

const app = require('./app');

const server = http.createServer(app);
const db = require('./config/database');

const socket = require('./sockets/reunion.socket');



socket.init(server);

server.listen(process.env.PORT, () => {

    console.log(
        `Serveur lancé sur le port ${process.env.PORT}`
    );
setInterval(async () => {
  try {
    await db.query("SELECT 1"); // ping MySQL
    console.log("Keep-alive DB OK");
  } catch (err) {
    console.error("Keep-alive error:", err.message);
  }
}, 60 * 1000);

});