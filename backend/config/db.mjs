import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Pipit01@', //password MySQL
    database: 'rental_mobil_dinas',
    waitForConnections: true,
    connectionLimit: 10
});

export default db;