const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema(
    {
        email:
        {
            type: String,
            required: true,
            unique: true
        }
    }
);

userSchema.plugin(passportLocalMongoose);//Adds in username,password field,hash function and a salt

const User = new mongoose.model('User', userSchema);

module.exports = User;