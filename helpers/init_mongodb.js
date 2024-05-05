const mongoose = require("mongoose");
const {process_params} = require("express/lib/router");

mongoose
    .connect(process.env.DB_URI, {dbName: process.env.DB_NAME})
    .then(() => {
        console.log("db connected successfully.");
    })
    .catch((err) => {
        console.log(err.message);
    });

mongoose.connection.on('connected', () => {
    console.log('Mongo DB connected to db.');
});

mongoose.connection.on("error", (err) => {
    console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongo db connection is disconnected.");
});

process.on("SIGINT", async() => {
   await mongoose.connection.close();
   process.exit(0);
});