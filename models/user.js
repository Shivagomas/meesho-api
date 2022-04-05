const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:3,
        maxlength:255
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength:5,
        maxlength: 1024
    },
    isAdmin: {
        type:Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema);

function generateAuthToken() {
    const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(255),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(5).max(1024),
        isAdmin: Joi.boolean()
    });
    return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;
exports.userSchema = userSchema;
exports.generateAuthToken = generateAuthToken;