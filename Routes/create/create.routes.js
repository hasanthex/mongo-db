const express = require("express");
const createError  = require("http-errors");
const router = express.Router();
const User = require("./../../Models/User.model");

router.get('/insert_one', async(req, res, next) => {
    try {
        console.log('Heressssssssssssssssss');
        res.sendFile(__dirname + "../../static/create/insert_one.html");
    } catch (error) {
        if(error.isJoi === true) error.status = 422
        next(error);
    }
});


module.exports = router;