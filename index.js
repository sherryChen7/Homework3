const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
// const config = require('configurarion')
const morgan = require('morgan')
const helmet = require('helmet')
const Joi = require('Joi')
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

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    console.log('Morgan enabled...')
    startupDebugger()
}

app.use(function(req, res, next){
    console.log('Authentication...')
    next()
})

const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'}
]

app.get('/', (req, res) => {
    res.render('index', {title:'My Express APP!!', message: 'Hello'})
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) //404
        return res.status(404).send('The course is not find.')
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema)
    console.log(result)
    if(result.error) {
        return res.send(result.error.details[0].message)
    }

    if (!req.body.name || req.body.name.length <3)
        res.status(404).send('aa')
    const course = {
        id: courses.length +1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {//404
        res.status(404).send('The course is not find.')
        return res.send(course)
    }

    // const result = validateCourse(req.body)
    // console.log(result)
    const { error } = validateCourse(req.body) // result.error
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    course.name = req.body.name
    res.send(course)
})

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {//404
        res.status(404).send('The course is not find.')
        return res.send(course)
    }

    // const result = validateCourse(req.body)
    // console.log(result)
    const { error } = validateCourse(req.body) // result.error
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    const i = courses.indexOf(course)
    courses.splice(i, 1)
    res.send(course)
})

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema)
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listen ${port} ...`))