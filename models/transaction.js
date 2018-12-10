const mongoose = require('mongoose')
const Joi = require('Joi')
const {deivceSchema} = require('./device')

const transactionSchema = new mongoose.Schema({
    transactionHash: {type: String, required: true},
    useAccount: String,
    device: {
        type: deivceSchema,
        required: true
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

function validateTransaction(transaction) {
    const schema = {
        transactionHash: Joi.string().min(3).required()
    };
    return Joi.validate(transaction, schema)
}

module.exports.Transaction = Transaction
module.exports.validate = validateTransaction