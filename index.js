const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
// const config = require('configurarion')
const morgan = require('morgan')
const helmet = require('helmet')

const courses = require('./routes/courses')
const home = require('./routes/home')
const express = require('express')
const app = express()

app.set('view engine', 'pug')
app.set('views', './views') //default

console.log(`NODE_ENV: + ${process.env.NODE_ENV}`)
console.log(`app: ${app.get('env')}`)

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static('public'))
app.use(helmet())
app.use('/api/courses', courses)
app.use('/', home)

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    console.log('Morgan enabled...')
    startupDebugger()
}

app.use(function(req, res, next){
    console.log('Authentication...')
    next()
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listen ${port} ...`))
