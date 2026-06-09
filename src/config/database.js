const mysql = require('mysql2/promise');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,

    connectTimeout: 2000000,
    acquireTimeout: 2000000,
    timeout: 2000000,

    ssl: {
        ca: fs.readFileSync('./src/config/ca.pem'),
        rejectUnauthorized: true
    }
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erreur connexion MySQL:', err.code);
        console.error(err.message);
        return;
    }

    console.log('✅ Connecté à MySQL Aiven');
    connection.release();
});

module.exports = pool;