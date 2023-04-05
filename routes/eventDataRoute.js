const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Web3 = require('web3');
const eventData = require('../models/eventData');

const CONTRACT_ABI = require('../abi.json');

const web3 = new Web3("https://eth-goerli.g.alchemy.com/v2/YtgaSmyXbM1O2QvE6hRZt7Bt9zd5a3Tf");

const contract = new web3.eth.Contract(CONTRACT_ABI, "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D");


//Post method for add past Transfer event data if USDC token in mongodb data base 

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
                Amount: Result.value
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

//API for delete all event data from data base

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
