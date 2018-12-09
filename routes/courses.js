const Joi = require('Joi')
const express = require('express')
const router = express.Router()

const deviceProvider = [
    {providerContractAddress:1, providerAccount:'123'},
    {providerContractAddress:2, providerAccount:'234'},
    {providerContractAddress:2, providerAccount:'345'}
]

const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'}
]

const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'}
]

router.get('/', (req, res) => {
    res.send(courses)
})

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) //404
        return res.status(404).send('The course is not find.')
    res.send(course)
})

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router