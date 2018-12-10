const mongoose = require('mongoose')
const Joi = require('Joi')

const deivceSchema = new mongoose.Schema({
    deviceID: {type: String, required: true},
    deivceContractAddress: String,
    providerContractAddress: String
})

const Device = mongoose.model('Device', deivceSchema)

function validateDevice(device) {
    const schema = {
        deviceID: Joi.required(),
        deivceContractAddress: Joi.required(),
        providerContractAddress: Joi.string().min(3).required()
    };
    return Joi.validate(device, schema)
}

module.exports.deivceSchema = deivceSchema
module.exports.Device = Device
module.exports.validate = validateDevice