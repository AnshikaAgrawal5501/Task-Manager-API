const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    Age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Invalid age');
            }
        }
    },
    Password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (validator.contains(value, 'password')) {
                throw new Error('password should not contain word password');
            }
        },
        minLength: [6, 'password length must be greater than 6'],
    }
});

module.exports = User;