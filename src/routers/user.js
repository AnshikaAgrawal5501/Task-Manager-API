const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users', async function(req, res) {

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
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

router.post('/users/login', async function(req, res) {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/logout', auth, async function(req, res) {

    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.status(200).send('Successfully logout !');
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/users/logoutAll', auth, async function(req, res) {

    try {
        req.user.tokens = [];
        await req.user.save();

        res.status(200).send('Successfully logout from all sessions !');
    } catch (error) {
        res.status(500).send(error);
    }
});

// -------------------      this has to be removed later        -------------------------------
router.get('/users', async function(req, res) {

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
// --------------------------------------------------

router.get('/users/me', auth, async function(req, res) {
    res.send(req.user);
});


// -------------------      no longer needed        -------------------------------
// router.get('/user/:id', async function(req, res) {

//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);

//         if (!user) {
//             res.status(400).send();
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         res.status(500).send();
//     }

//     // User.findById(_id).then((response) => {
//     //     if (!response) {
//     //         res.status(400).send();
//     //     }
//     //     res.status(200).send(response);
//     // }).catch((error) => {
//     //     res.status(500).send();
//     // });
// });

router.patch('/user/me', auth, async function(req, res) {

    const update = Object.keys(req.body);
    const allowed = ['name', 'age', 'email', 'password'];
    const isValid = update.every((update) => allowed.includes(update));

    if (!isValid) {
        return res.status(400).send('error : invalid!');
    }

    // const _id = req.user._id;

    try {

        // const user = await User.findById(_id);
        update.forEach((update) => req.user[update] = req.body[update]);

        req.user.save();
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        // if (!user) {
        //     res.status(400).send();
        // }
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

router.delete('/user/me', auth, async function(req, res) {

    // const _id = req.user._id;

    try {
        // const user = await User.findByIdAndDelete(_id);

        // if (!user) {
        //     res.status(400).send();
        // }

        await req.user.remove(); // works same as above commented code

        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;