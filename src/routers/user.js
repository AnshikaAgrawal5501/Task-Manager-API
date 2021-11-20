const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');

const upload = multer({
    // dest: 'images',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(JPG|jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload only images.'));
        }
        return cb(undefined, true);
    }
});

const router = new express.Router();

router.post('/users', async function(req, res) {

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();

        sendWelcomeEmail(user.email, user.name);

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


// "data:image/jpg;base64," -> prepend this to src attribute of img tag to cross check the image
router.post('/users/me/avatar', auth, upload.single('avatar'), async function(req, res) {

    const buffer = await sharp(req.file.buffer).resize({ width: 500, height: 500 }).png().toBuffer();
    req.user.avatar = buffer; //binary data of image
    // req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send('Successfully uploaded');
}, function(error, req, res, next) {
    res.status(400).send({ error: error.message });
});

// -------------------      this has to be removed later        -------------------------------
router.get('/users', async function(req, res) {

    try {
        const user = await User.find({});
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send();
    }
});
// --------------------------------------------------

router.get('/users/me', auth, async function(req, res) {
    res.send(req.user);
});

router.get('/users/:id/avatar', async function(req, res) {

    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error('Image not found');
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(user.avatar);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.patch('/user/me', auth, async function(req, res) {

    const update = Object.keys(req.body);
    const allowed = ['name', 'age', 'email', 'password'];
    const isValid = update.every((update) => allowed.includes(update));

    if (!isValid) {
        return res.status(400).send('error : invalid!');
    }

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
        sendCancellationEmail(req.user.email, req.user.name);

        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

router.delete('/users/me/avatar', auth, async function(req, res) {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

module.exports = router;