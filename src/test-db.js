require('dotenv').config();

const db = require('./config/database');

(async () => {

    try {

        const [rows] =
            await db.query(
                'SELECT NOW() AS date'
            );

        console.log(rows);

    } catch (error) {

        console.error(error);

    }

})();