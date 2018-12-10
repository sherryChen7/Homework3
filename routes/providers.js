const mongoose = require('mongoose')
const Joi = require('Joi')
const express = require('express')
const router = express.Router()

const providerSchema = new mongoose.Schema({
    providerContractAddress: {type: String, required: true},
    providerAccount: String
})

const Provider = mongoose.model('Provider', providerSchema)

router.get('/', async (req, res) => {
    const provider = await Provider.find().sort('providerContractAddress')
    res.send(provider)
})

router.post('/', async (req, res) => {
    const { error } = validateCourse(req.body)
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    let provider = new Provider({ providerContractAddress: req.body.providerContractAddress });
    provider = await provider.save()
    res.send(provider)
})

router.put('/:id', async (req, res) => {
    const { error } = validateCourse(req.body) // result.error
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    const provider = await Provider.findByIdAndUpdate(req.params.id, { providerContractAddress: req.body.providerContractAddress }, {
        new: true
    })

    if (!provider) {//404
        return res.status(404).send('The provider is not find.')
    }

    res.send(provider)
})

router.delete('/:id', async (req, res) => {
    const provider = await Provider.findByIdAndRemove(req.params.id)

    if(!provider) {
        return res.status(404).send('The provider with the given ID cannot delete.')
    }

    res.send(provider)
})

router.get('/:id', async (req, res) => {
    const provider = await Provider.findByIdAndRemove(req.params.id)
    
    if (!provider) //404
        return res.status(404).send('The provider with the given ID cannot find.')
    res.send(provider)
})

function validateCourse(course) {
    const schema = {
        providerContractAddress: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema)
}

module.exports = router