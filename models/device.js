const mongoose = require('mongoose')
const Joi = require('Joi')

const deivceSchema = new mongoose.Schema({
    deivceID: {type: String, required: true},
    deivceContractAddress: String,
    providerContractAddress: String
})

const Device = mongoose.model('Device', deivceSchema)

function validateDevice(device) {
    const schema = {
        providerContractAddress: Joi.string().min(3).required()
    };
    return Joi.validate(device, schema)
}

module.exports.Device = Device
module.exports.validate = validateDevice