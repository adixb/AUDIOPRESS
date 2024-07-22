const mysql = require('mysql');
const dotenv = require('dotenv') ; 
dotenv.config() ; 

const sqlPass = process.env.SQL_PASSWORD ;

async function sqlConnection() {
    const dbConnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password:sqlPass ,
        database: 'UserAuth'
    });

    dbConnection.connect((err) => {
        if (err) {
            console.error("Error connecting to SQL Database:", err.message);
        } else {
            console.log('Connected to SQL Database as ID', dbConnection.threadId);
        }
    });

    return dbConnection;
}

module.exports = {
    sqlConnection,
};
