const express = require('express')
const app = express();
const morgan = require('morgan')
const apiRouter = require('./api')

app.use(morgan('dev'));

app.use('/api', apiRouter)


app.listen(8000)

