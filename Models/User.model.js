const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at:{
        type: Number,
        required: true
    }
});

/*
 * mongoose middleware before create new user
**/
UserSchema.pre("save", async function(next){
   try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
   } catch (error) {
       next(error);
   }
});

UserSchema.methods.isValidPassword = async function(password){
    try {
        return await bcrypt.compare(password, this.password);
    } catch(error) {
        throw error;
    }
}

const User = mongoose.model('users', UserSchema);
module.exports = User;