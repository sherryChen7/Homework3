const { Transaction, validate } = require('../models/transaction')
const { Device } = require('../models/device')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const transaction = await Transaction.find()
    res.send(transaction)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    const device = await Device.findById(req.body.deivceID)
    if (!device) {
        return res.status(400).send('Invalid device.')
    }

    let transaction = new Transaction({ 
        transactionHash: req.body.transactionHash, 
        useAccount: req.body.useAccount, 
        device: {
            deviceID: device.deivceID
        } 
    })
    transaction = await transaction.save()
    res.send(transaction)
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body) // result.error
    if(error) {
        return res.status(404).send(error.details[0].message)
    }

    const transaction = await Transaction.findByIdAndUpdate(req.params.id, { deviceID: req.body.deviceID }, {
        new: true
    })

    if (!transaction) {//404
        return res.status(404).send('The transaction is not find.')
    }

    res.send(transaction)
})

router.delete('/:id', async (req, res) => {
    const transaction = await Transaction.findByIdAndRemove(req.params.id)

    if(!transaction) {
        return res.status(404).send('The transaction with the given ID cannot delete.')
    }

    res.send(transaction)
})

router.get('/:id', async (req, res) => {
    const transaction = await Transaction.findByIdAndRemove(req.params.id)
    
    if (!transaction) //404
        return res.status(404).send('The transaction with the given Hash cannot find.')
    res.send(transaction)
})

module.exports = router