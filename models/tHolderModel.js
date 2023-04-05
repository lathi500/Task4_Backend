const mongoose = require('mongoose');

const tHolderSchma = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    HolderAddress: { type: String },
    Balance: { type: Number } // default keyword set default value of given field
})

module.exports = mongoose.model('tHolder', tHolderSchma);