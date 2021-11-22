const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async() => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Anshika Agrawal',
            email: 'anshikaagrawal539@gmail.com',
            password: 'anshika123@1'
        })
        .expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Anshika Agrawal',
            email: 'anshikaagrawal539@gmail.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('anshika123@1');
});

test('Should login existing user', async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(201);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async() => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'thisisnotmypass'
        })
        .expect(400);
});

test('Should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
});

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .expect(401);
});

test('Should delete account for user', async() => {
    await request(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);

    const user = await User.findById(userOneId)
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticate user', async() => {
    await request(app)
        .delete('/user/me')
        .expect(401);
});

test('Should upload avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/avatar_image.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async() => {
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Ananya Garg'
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Ananya Garg');
});

test('Should not update invalid user fields', async() => {
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Rishikesh'
        })
        .expect(400);
});

test('Should not signup user with invalid name/email/password', async() => {
    await request(app)
        .post('/users')
        .send({
            name: 'Anshika Agrawal',
            email: 'anshikaagrawal539@gmail.com',
            password: 'password'
        })
        .expect(400);
});

test('Should not signup user with invalid name/email/password', async() => {
    await request(app)
        .post('/users')
        .send({
            name: 'Anshika Agrawal',
            email: 'anshikaagrawal.com',
            password: 'password'
        })
        .expect(400);
});

test('Should not update user if unauthenticated', async() => {
    await request(app)
        .patch('/user/me')
        .expect(401);
});

test('Should not update user with invalid name/email/password', async() => {
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: 'password'
        })
        .expect(400);
});