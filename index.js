const express = require('express')
const app = express()

require('dotenv').config()

const knex = require('./src/config/db')
const consign = require('consign')

app.use('/public', express.static(__dirname + '/public/'));

app.db = knex

consign()
    .include('./src/config/auth.js')
    .then('./src/config/middlewares.js')
    .then('./src/controllers')
    .then('./src/services')
    .then('./src/routes/')
    .into(app)



app.listen(process.env.PORT || 5000, () => {
    console.log('Backend executando...')
})