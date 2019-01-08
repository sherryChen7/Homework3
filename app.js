const mongoose = require('mongoose')
const startupDebugger = require('debug')('app:startup')
const path = require('path')
const config = require('config')
const logger = require('./logger')
const morgan = require('morgan')
const helmet = require('helmet')
const providers = require('./routes/providers')
const devices = require('./routes/devices')
const transactions = require('./routes/transactions')
const users = require('./routes/users')
const index = require('./routes/index')
const express = require('express')
const app = express()

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Could not connect to MongoDB...'))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(logger)
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet())

// console.log(`App name:${config.get('name')}`)
// console.log(`password:${config.get('mail.password')}`)

if (app.get('env') === 'development') {
    app.use(morgan('dev'))
    console.log('Morgan enabled...')
    startupDebugger()
}

app.use(function (req, res, next) {
    console.log('Authentication...')
    next()
})

app.use('/api/providers', providers)
app.use('/api/devices', devices)
app.use('/api/transactions', transactions)
app.use('/api/users', users)
app.use('/', index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;