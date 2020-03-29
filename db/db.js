const Sequelize = require('sequelize')
const databaseUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/mtaroutes'
const db = new Sequelize(databaseUrl, {
    logging: false,
})


const Route = db.define('route', {
    name: {
        type: Sequelize.STRING,
    },
    line: {
        type: Sequelize.ARRAY(Sequelize.JSON)
    }
})


module.exports = {
    db, 
    Route,
}