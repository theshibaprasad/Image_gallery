const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.mongo_url);
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database")
    }
}

module.exports = connectDB;