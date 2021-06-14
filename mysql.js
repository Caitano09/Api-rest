const mysql2 = require('mysql2')

const pool = mysql2.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'ecommerce',
    port: 3306
  
})

module.exports = pool