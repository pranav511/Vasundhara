const mysql = require('mysql2/promise');

const pool  = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'Vasundhara_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async ()=>{
    try {
        const connection = await pool.getConnection();
        console.log("Connected to MySQL database successfully !");
    } catch (error) {
        console.log("Connection falied", error.message);
    }
})();

module.exports = pool;

