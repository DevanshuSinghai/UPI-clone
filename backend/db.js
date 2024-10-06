const mongoose = require('mongoose')
const {CONNECTION_URI} = require("./KEYS/config")

mongoose.connect(CONNECTION_URI)

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
    },
    password: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 6,
        maxlength: 30,
    },
    mail:  {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 6,
        maxlength: 30,
    }
})

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // reference to user model
        ref: "User", // ensures that user who is already in User collection can add data of himself
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const account = mongoose.model('Account', accountSchema)
const user = mongoose.model('Users', userSchema)

module.exports = {
    User:user,
    Account: account
}