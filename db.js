const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/inootbook?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

// For Connecting to database MongoDb;

const connectTomongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo");
    })
}

module.exports = connectTomongo;