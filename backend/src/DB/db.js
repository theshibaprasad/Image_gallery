const mongoose = require('mongoose');

async function connectDB() {
    try {
           const mongoUrl = process.env.MONGO_URL || process.env.mongo_url;
           if (!mongoUrl) {
              throw new Error("Missing MONGO_URL in environment");
           }

           if (mongoose.connection.readyState === 1) {
              return;
           }

           await mongoose.connect(mongoUrl);
           console.log("Connected to database");
    } catch (error) {
           console.log("Error connecting to database");
           throw error;
    }
}

module.exports = connectDB;