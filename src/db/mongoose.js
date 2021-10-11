const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const user = mongoose.model('User', {
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

const me = new user({
    Name: 'Anshika',
    Email: 'anshikaagrawal5501@gmail.com',
    Password: '123anshika',
    Age: 21
});

me.save().then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(error);
});

const task = new mongoose.model('Task', {
    Description: {
        type: String,
        required: true,
        trim: true,
    },
    Completed: {
        type: Boolean,
        default: false,
    }
});

const task1 = new task({
    Description: 'Wake up',
    Completed: true,
});

task1.save().then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(error);
});