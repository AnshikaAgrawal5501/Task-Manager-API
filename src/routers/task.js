const express = require('express');
const Task = require('../models/task');

const router = new express.Router();

router.post('/tasks', async function(req, res) {

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

router.get('/tasks', async function(req, res) {

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

router.get('/task/:id', async function(req, res) {

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

router.patch('/task/:id', async function(req, res) {

    const _id = req.params.id;

    const update = Object.keys(req.body);
    const allowed = ['description', 'completed'];
    const isValid = update.every((update) => allowed.includes(update));

    if (!isValid) {
        return res.status(400).send('error : invalid!');
    }

    try {

        const task = await Task.findById(_id);

        update.forEach((update) => task[update] = req.body[update]);

        task.save();

        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        if (!task) {
            res.status(400).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
});

router.delete('/task/:id', async function(req, res) {
    const _id = req.params.id;

    try {
        const task = await Task.findByIdAndDelete(_id);

        if (!task) {
            res.status(400).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;