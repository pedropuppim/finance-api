const express = require('express')
const app = express()

require('dotenv').config()

const db = require('./src/config/db')

const consign = require('consign')

consign()
    .include('./src/config/auth.js')
    .then('./src/config/middlewares.js')
    .then('./src/controllers')
    .then('./src/routes/')
    .into(app)

app.db = db


app.listen(5000, () => {
    console.log('Backend executando...')
})