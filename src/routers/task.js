const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');

const router = new express.Router();

router.post('/tasks', auth, async function(req, res) {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

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


// GET /tasks -> all the tasks
// GET /tasks?completed=trueOrfalse -> returns tasks if completed or not
// GET /tasks?limit=10&skip=10 -> displays 10 tasks and skip starting 10 tasks
// GET /taks?sortBy=createdAt:descOrasc -> sort the tasks as per their creation time [for desc we should use -1 in code and for asc we use 1]
// GET /tasks?sortBy=completed:descOrasc -> sort the tasks as per their completion 
router.get('/tasks', auth, async function(req, res) {

    const match = {};
    const sort = {};
    let limit = 10;
    let skip = 0;

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.limit) {
        limit = parseInt(req.query.limit);
    }

    if (req.query.skip) {
        skip = parseInt(req.query.skip);
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':'); // split into [createdAt, descOrasc]
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        // const task = await Task.find({});

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit,
                skip,
                sort,
            },
        });
        res.status(200).send(req.user.tasks);
    } catch (error) {
        res.status(500).send();
    }

    // Task.find({}).then((response) => {
    //     res.status(200).send(response);
    // }).catch((error) => {
    //     res.status(500).send();
    // });
});

router.get('/task/:id', auth, async function(req, res) {

    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

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

router.patch('/task/:id', auth, async function(req, res) {

    const update = Object.keys(req.body);
    const allowed = ['description', 'completed'];
    const isValid = update.every((update) => allowed.includes(update));

    if (!isValid) {
        return res.status(400).send('error : invalid!');
    }

    const _id = req.params.id;

    try {

        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            res.status(400).send();
        }

        update.forEach((update) => task[update] = req.body[update]);
        await task.save();

        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
});

router.delete('/task/:id', auth, async function(req, res) {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

        if (!task) {
            res.status(400).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;