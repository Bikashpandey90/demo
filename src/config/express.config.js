const express = require('express')
const apiRouter = require('../router/router')

require('./db.config')


const app = express()


app.use(express.json())
app.use(express.urlencoded(
    {
        extended: true
    }
))

app.use('/api/v1', apiRouter)

app.use((req, res, next) => {
    next({
        code: 404,
        message: "Not found",
        status: "NOT_FOUND"
    })
})

module.exports = app;
