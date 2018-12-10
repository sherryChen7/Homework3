const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('Connected to MongoDB...'))
.catch(error => console.error('Could not connect to MongoDB...'))

const providerSchema = new mongoose.Schema({
    providerContractAddress: {type: String, required: true},
    providerAccount: String
})

const deviceSchema = new mongoose.Schema({
    deviceId: String,
    deviceContractAddress: String,
    providerContractAddress: String
})

const transactionSchema = new mongoose.Schema({
    transactionHash: String,
    providerAccount: String,
    timestamp: {type: Date, default: Date.now},
    userAccount: String,
    deviceId:String
})

const Provider = mongoose.model('Provider', providerSchema)

async function createProvider() {  
    const provider = new Provider({
        // providerContractAddress: '1',
        providerAccount: "223"
    })

    try {
        // await provider.validate()
        const result = await provider.save()
        console.log(result)
    } catch (error) {
        console.log(error.message)
    }
}

createProvider()

async function getProvider() {
    // eq (equal)
    // ne (net equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt
    // lte
    // in
    // nin (not in)
    const providers = await Provider
    .find({providerAccount:'232'})
    .limit(10)
    .sort({providerContractAddress:'1'})
    .select({providerContractAddress:'1', providerAccount:'123'})
    console.log(providers)
}

getProvider()

async function updateProvider(id) {
    const result = await Provider.findByIdAndUpdate({_id: id}, {
        $set: {
            providerAccount : '262'
        }
    }, {new: true})
    console.log(result)
}

updateProvider('5c0d39c7636efa95608bb35d')

async function deleteProvider(id) {
    const result = await Provider.deleteOne({_id: id})
    console.log(result)
    // const provider = await Provider.deleteMany({_id: id})
    // console.log(provider)
}

deleteProvider('5c0d39c7636efa95608bb35d')