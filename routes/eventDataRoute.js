const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Web3 = require('web3');
const eventData = require('../models/eventData');

const CONTRACT_ABI = require('../abi.json');

//Note: here you have to add your node connection provider key that provided by alchemy.

const web3 = new Web3( process.env.Node_Provider );


const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.TOKEN_ADDRESS);


//Post method for add past Transfer event data if USDC token in mongodb database 

router.post('/', (req, res, next) => {
    contract.getPastEvents('Transfer', {
        filter: { myIndexedParam: [20, 23], myOtherIndexedParam: '0x123456789...' }, // Using an array means OR: e.g. 20 or 23
        fromBlock: 8248857,
        toBlock: 'latest'
    }, function (error, events) {
        const eventdatarray = [];
        for (var i = 0; i < events.length; i++) {
            const Result = events[i].returnValues;
            var singleRow = {
                _id: new mongoose.Types.ObjectId,
                From: Result.from,
                To: Result.to,
                Amount: web3.utils.fromWei(Result.value)
            };
            eventdatarray.push(singleRow);
        }
        eventData.insertMany(eventdatarray).then(() =>
            res.status(200).json({
                THOLDERDATA: eventdatarray
            })
        ).catch((err) => {
            res.status(500).json({
                Error: err
            })
            console.log(err);
        })
    })
})

//API for delete all event data from database

router.delete('/', (req, res, next) => {
    eventData.deleteMany({}).then(result => {
        res.status(200).json(result);
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})



module.exports = router;
