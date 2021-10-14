const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/users', async function(req, res) {

    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }

    // user.save().then((response) => {
    //     console.log(response);
    //     res.status(201).send(response);
    // }).catch((error) => {
    //     console.log(error);
    //     res.status(400).send(error);
    // });
});

app.get('/users', async function(req, res) {

    try {
        const user = await User.find({});
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send();
    }

    // User.find({}).then((response) => {
    //     res.status(200).send(response);
    // }).catch((error) => {
    //     res.status(500).send();
    // });
});

app.get('/user/:id', async function(req, res) {

    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if (!user) {
            res.status(400).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send();
    }

    // User.findById(_id).then((response) => {
    //     if (!response) {
    //         res.status(400).send();
    //     }
    //     res.status(200).send(response);
    // }).catch((error) => {
    //     res.status(500).send();
    // });
});

app.post('/tasks', async function(req, res) {

    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }

    // task.save().then((response) => {
    //     console.log(response);
    //     res.status(201).send(response);
    // }).catch((error) => {
    //     console.log(error);
    //     res.status(400).send(error);
    // });
});

app.get('/tasks', async function(req, res) {

    try {
        const task = await Task.find({});
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }

    // Task.find({}).then((response) => {
    //     res.status(200).send(response);
    // }).catch((error) => {
    //     res.status(500).send();
    // });
});

app.get('/task/:id', async function(req, res) {

    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);

        if (!task) {
            res.status(400).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }

    // Task.findById(_id).then((response) => {
    //     if (!response) {
    //         res.status(400).send();
    //     }
    //     res.status(200).send(response);
    // }).catch((error) => {
    //     res.status(500).send();
    // });

});

app.listen(process.env.PORT || port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
});