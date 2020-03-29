const Sequelize = require('sequelize')
const databaseUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/mtaroutesvisualization'
const db = new Sequelize(databaseUrl, {
    logging: false,
})


const Route = db.define('route', {
    name: {
       type: Sequelize.STRING,
       unique: true
    },
    line: {
        type: Sequelize.ARRAY(Sequelize.JSON)
    }
})



module.exports = {
    db, 
    Route,
}