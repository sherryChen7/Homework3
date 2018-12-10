const mongoose = require('mongoose')
const startupDebugger = require('debug')('app:startup')
const config = require('config')
const logger = require('./logger')
const morgan = require('morgan')
const helmet = require('helmet')
const providers = require('./routes/providers')
const devices = require('./routes/devices')
const home = require('./routes/home')
const express = require('express')
const app = express()

mongoose.connect('mongodb://localhost/vidly')
.then(() => console.log('Connected to MongoDB...'))
.catch(error => console.error('Could not connect to MongoDB...'))

app.set('view engine', 'pug')
app.set('views', './views') //default

app.use(express.json())
app.use(logger)
app.use(express.urlencoded({extended : true}))
app.use(express.static('public'))
app.use(helmet())

console.log(`App name:${config.get('name')}`)
console.log(`password:${config.get('mail.password')}`)

if (app.get('env') === 'development') {
    app.use(morgan('dev'))
    console.log('Morgan enabled...')
    startupDebugger()
}

app.use(function(req, res, next){
    console.log('Authentication...')
    next()
})

app.use('/api/providers', providers)
app.use('/api/devices', devices)
app.use('/', home)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listen ${port} ...`))
