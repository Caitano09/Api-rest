const mysql2 = require('mysql2')

const pool = mysql2.createPool({
    connectionLimit: 1000,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    //password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT

})

const execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, result, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = { pool, execute }