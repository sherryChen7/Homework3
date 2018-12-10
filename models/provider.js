const mongoose = require('mongoose')
const Joi = require('Joi')

const providerSchema = new mongoose.Schema({
    providerContractAddress: {type: String, required: true},
    providerAccount: String
})

const Provider = mongoose.model('Provider', providerSchema)

function validateProvider(course) {
    const schema = {
        providerContractAddress: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema)
}

module.exports.Provider = Provider
module.exports.validate = validateProvider