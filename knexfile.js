const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'Wzx511002',
        database: 'volcanoes'
    }
});

module.exports = knex;