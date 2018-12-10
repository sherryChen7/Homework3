const mongoose = require('mongoose')
const Joi = require('Joi')
const express = require('express')
const router = express.Router()

const deivceSchema = new mongoose.Schema({
    deivceID: {type: String, required: true},
    deivceContractAddress: String,
    providerContractAddress: String
})

const Device = mongoose.model('Device', deivceSchema)

router.get('/', async (req, res) => {
    const device = await Device.find()
    res.send(device)
})

router.post('/', async (req, res) => {
    const { error } = validateDevice(req.body)
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    let device = new Device({ 
        deivceID: req.body.deivceID, 
        deivceContractAddress: req.body.deivceContractAddress, 
        providerContractAddress: req.body.providerContractAddress 
    })
    device = await device.save()
    res.send(device)
})

router.put('/:id', async (req, res) => {
    const { error } = validateDevice(req.body) // result.error
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    const device = await Device.findByIdAndUpdate(req.params.id, { deivceID: req.body.deivceID }, {
        new: true
    })

    if (!device) {//404
        return res.status(404).send('The device is not find.')
    }

    res.send(device)
})

router.delete('/:id', async (req, res) => {
    const device = await Device.findByIdAndRemove(req.params.id)

    if(!device) {
        return res.status(404).send('The device with the given ID cannot delete.')
    }

    res.send(device)
})

router.get('/:id', async (req, res) => {
    const device = await Device.findByIdAndRemove(req.params.id)
    
    if (!device) //404
        return res.status(404).send('The device with the given ID cannot find.')
    res.send(device)
})

function validateDevice(device) {
    const schema = {
        providerContractAddress: Joi.string().min(3).required()
    };
    return Joi.validate(device, schema)
}

module.exports = router