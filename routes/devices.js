const { Device, validate } = require('../models/device')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const device = await Device.find()
    res.send(device)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    let device = new Device({ 
        deviceID: req.body.deviceID, 
        deivceContractAddress: req.body.deivceContractAddress, 
        providerContractAddress: req.body.providerContractAddress 
    })
    device = await device.save()
    res.send(device)
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body) // result.error
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    const device = await Device.findByIdAndUpdate(req.params.id, { deviceID: req.body.deviceID }, {
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

module.exports = router