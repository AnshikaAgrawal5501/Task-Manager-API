const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/users', function(req, res) {

    const user = new User(req.body);

    user.save().then((response) => {
        console.log(response);
        res.status(201).send(response);
    }).catch((error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

app.post('/tasks', function(req, res) {

    const task = new Task(req.body);

    task.save().then((response) => {
        console.log(response);
        res.status(201).send(response);
    }).catch((error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

app.listen(process.env.PORT || port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
});