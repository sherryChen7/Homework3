const mongoose = require('mongoose')
const Joi = require('Joi')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:5,
        maxlength:255
    },
    email: {
        type: String,
        required: true,
        minlength:5,
        maclength:255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength:5,
        maxlength:1024
    }
})

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(244).required()
    };
    return Joi.validate(course, schema)
}

module.exports.User = User
module.exports.validate = validateUser