const express = require('express')
const apiRouter = require('../router/router')
const cors = require("cors");


require('./db.config')


const app = express()
app.use(cors({
    origin: [
        "https://momoguysfe.vercel.app",   // your frontend domain
        "http://localhost:5173",         // for dev
        "http://192.168.0.100:5173"           // for dev

    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))


app.use(express.json())
app.use(express.urlencoded(
    {
        extended: false
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
