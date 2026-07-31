const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already Taken"],
        required: true,


    },
    email:{
        type: String,
        unique: [true, "an Account already Exists with this Email"],
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel