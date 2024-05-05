const express = require("express");
const createError  = require("http-errors");
const router = express.Router();
const User = require("./../../Models/User.model");

router.post('/register', async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // if(!email || !password) throw createError.BadRequest("Email or Password Missing");
        const result = await authSchema.validateAsync(req.body);

        const userExists = await User.findOne({email: result.email});

        if(userExists) throw createError.Conflict(`${result.email} already exists`);

        const user = new User({
            email: result.email,
            password: result.password,
            username: result.email,
            created_at: new Date().getTime()
        });

        const storeUser = await user.save();
        const accessToken = await signAccessToken(storeUser.id);
        const refreshToken = await signRefreshToken(storeUser.id);

        res.send({storeUser, accessToken, refreshToken});
    } catch (error) {
        if(error.isJoi === true) error.status = 422
        next(error);
    }
});

router.post('/login', async(req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);

        const user = await User.findOne({email: result.email});

        if(!user) throw createError.NotFound("This Email Is Not Registered.");

        const isMatch = await user.isValidPassword(result.password);

        if(!isMatch) throw createError.Unauthorized('Username/Password not valid.');

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({result, accessToken, refreshToken});
    } catch (error) {
        if(error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password"));
        next(error);
    }
});

router.post('/refresh-token', async(req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) throw createError.BadRequest();

        const uid = await verifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(uid);
        const refToken = await signRefreshToken(uid);

        res.send({accessToken, refreshToken: refToken});
    } catch (e) {
        next(e);
    }
});

router.delete('/logout', async(req, res, next) => {
    res.send("Logout Route");
});

module.exports = router;