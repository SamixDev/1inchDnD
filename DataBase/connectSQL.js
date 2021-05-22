var sql = require("mysql");
require('dotenv').config();


// Create a connection to the database
var pool = sql.createPool({
    connectionLimit: 50,
    host: process.env.DB_HOST, // i use "localhost"
    user: process.env.DB_USER, //mysql username
    password: process.env.DB_PASS, //mysql password
    database: process.env.DB_DATABASE //your database name

});

// open the MySQL connection
// pool.connect(err => {
//     if (err) throw err;
//     console.log("Successfully connected to the database.");
// });

//async function to connect to DB with given sql query
async function connect(sql) {

    return new Promise((resolve, reject) => {
        pool.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = { connect };