const fs = require('fs');
require('dotenv').config();
const MC_address = fs.readFileSync('./MC_address.txt').toString();


//讀進合約abi,bytecode
const MCAbi = JSON.parse(fs.readFileSync('./contract/FourPattern_Two_sol_MonitorContract.abi').toString());
const MCBytecode = '0x' + fs.readFileSync('./contract/FourPattern_Two_sol_MonitorContract.bin').toString();
const CCAbi = JSON.parse(fs.readFileSync('./contract/FourPattern_Two_sol_ContainerContract.abi').toString());
const CCBytecode = '0x' + fs.readFileSync('./contract/FourPattern_Two_sol_ContainerContract.bin').toString();
const ADCAbi = JSON.parse(fs.readFileSync('./contract/FourPattern_Two_sol_AnomalyDetectionContract.abi').toString());
const ADCBytecode = '0x' + fs.readFileSync('./contract/FourPattern_Two_sol_AnomalyDetectionContract.bin').toString();


module.exports ={
    mysql: {
        host: process.env.HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    },
    MC: {
        abi: MCAbi,
        bytecode: MCBytecode,
        address:MC_address
        //address:process.env.MC_address
    },
    CC: {
        abi: CCAbi,
        bytecode: CCBytecode,
        //address:CC_address
    },
    ADC: {
        abi: ADCAbi,
        bytecode: ADCBytecode,
        //address:ADC_address
    },
    geth: {
        //account: nowAccount,
        //暫時不用
        account:'0x8424dfd424a731ebefc1dbba373dc678430acf0b',
        password: process.env.password
    }
};