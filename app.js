const express = require("express");
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const tHolderRoutes = require('./routes/tHolderRoutes');
const eventdataRoutes = require('./routes/eventDataRoute');


//Providing connection with mongodb atldas Data base
//you should give your mongodb atlas password and data base name

mongoose.connect('mongodb+srv://BhavinT:' + process.env.Mongo_Atlas_PS + '@cluster0.pt58e.mongodb.net/?retryWrites=true&w=majority' );

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/TokenHolderData', tHolderRoutes);
app.use('/AddEventData', eventdataRoutes);

app.use((req, res, next) => {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error); 
})

app.use(( error, req, res, next ) => {
    res.status( error.status || 500 ).json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;