const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const csv = require("csvtojson");
const tHolder = require('../models/tHolderModel');

const web3 = require('web3');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

var uploads = multer({ storage: storage });

//Post api for adding Token Holder data in database

router.post('/', uploads.single('csvFile'), (req, res, next) => {
    importFile('./public' + '/uploads/' + req.file.filename);
    function importFile(filepath) {
        csv().fromFile(filepath).then(source => {
            var arrayToInsert = [];
            for (var i = 0; i < 1000; i++) {
                var singleRow = {
                    _id: new mongoose.Types.ObjectId,
                    HolderAddress: source[i].HolderAddress,
                    Balance: web3.utils.fromWei(source[i].Balance, 'ether')
                };
                arrayToInsert.push(singleRow);
            }

            tHolder.insertMany(arrayToInsert).then(() =>
                res.status(200).json({
                    THOLDERDATA: arrayToInsert
                })
            ).catch((err) => {
                res.status(500).json({
                    Error: err
                })
                console.log(err);
            })
        })
    }
})

//Get api for getting Token Holder data from database

router.get('/', (req, res, next) => {
    tHolder.find().then(doc => {
        const responce = {
            tHolder: doc.map(dc => {
                return {
                    _id: dc._id,
                    HolderAddress: dc.HolderAddress,
                    Balance: dc.Balance
                }
            })
        }

        res.status(200).json({ responce })
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});

//API for delete data using token HolderID

router.delete('/:tHolderID', (req, res, next) => {
    const id = req.params.tHolderID;
    tHolder.deleteOne({ _id: id }).then(result => {
        res.status(200).json(result);
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

//API for delete all data

router.delete('/', (req, res, next) => {
    tHolder.deleteMany({}).then(result => {
        res.status(200).json(result);
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})


module.exports = router;

