const mysql = require('mysql2');

// Establish connection to the mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Gtrnissan2023!',
        database: 'election'
    },
    console.log('Connected to the election database.')
);



module.exports = db;