const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require("dotenv").config();
require("./helpers/init_mongodb");

/*
 * import route
**/
const InsertRoute = require("./Routes/create/create.routes");

/*
 * init express
**/
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*
 * log the request into the console
**/
app.use(morgan('dev'));

app.get("/", async(req, res, next) => {
    try {
        // res.send("Hello from express");
        res.sendFile(__dirname + "/static/index.html");
    } catch (e) {
        next(e);
    }
});

/*
 * init auth route to the express router
**/
app.use('/insert', InsertRoute);

/*
 * set default not found error
**/
app.use(async(req, res, next) => {
    next(createError.NotFound("Unable to access route."));
});


app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: err.status || 500,
        message: err.message
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})