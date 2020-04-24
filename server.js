const express = require('express')
const app = express();
const morgan = require('morgan')
const apiRouter = require('./api')
const { db } = require('./db/db')
app.use(morgan('dev'));
app.use(express.json())
app.use('/api', apiRouter)
// db.sync();
db.sync()
app.listen(8000)


