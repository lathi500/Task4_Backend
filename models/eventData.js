const mongoose = require('mongoose');

const eventData = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    From: { type: String },
    To: { type: String },
    Amount: { type: Number } 
})

module.exports = mongoose.model('eventdata', eventData);