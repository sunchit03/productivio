const mongoose = require("mongoose");
require("dotenv").config();

console.log("MongoDB URI:", "mongodb+srv://productivio:IJIstoPkvCViLxQ7@productivio.2ombe.mongodb.net/?retryWrites=true&w=majority&appName=Productivio");
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://productivio:IJIstoPkvCViLxQ7@productivio.2ombe.mongodb.net/?retryWrites=true&w=majority&appName=Productivio", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;