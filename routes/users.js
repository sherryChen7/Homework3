const { User, validate } = require('../models/user')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if(user) return res.status(400).send('User already registered.')

    user = new User({
        name: req.body.name,
        email: req.body.email,
        passsword: req.body.passsword
    })

    await user.save()
    res.send(user)
})

module.exports = router