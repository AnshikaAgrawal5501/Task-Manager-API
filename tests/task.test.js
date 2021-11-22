const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201);

    const task = await Task.findById(response.body._id);

    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should fetch user tasks', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);

    expect(response.body.length).toEqual(2);
});

test('Should not delete other users tasks', async() => {
    const response = await request(app)
        .delete(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(400);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});

test('Should not delete task if unauthenticated', async() => {
    const response = await request(app)
        .delete(`/task/${taskOne._id}`)
        .expect(401);
});

test('Should delete user task', async() => {
    const response = await request(app)
        .delete(`/task/${taskThree._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(200);

    const task = await Task.findById(taskThree._id);
    expect(task).toBeNull();
});

test('Should not update other users task', async() => {
    const response = await request(app)
        .patch(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(400);

    const task = await Task.findById(taskOne._id);
    expect(task.completed).toBe(false);
});

test('Should fetch user task by id', async() => {
    const response = await request(app)
        .get(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);

    expect(response.body.description).toBe('First task');
});

test('Should not create task with invalid description/completed', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test',
            completed: 'always'
        })
        .expect(400);
});

test('Should not update task with invalid description/completed', async() => {
    const response = await request(app)
        .patch(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'always'
        })
        .expect(500);
});

test('Should not fetch user task by id if unauthenticated', async() => {
    const response = await request(app)
        .get(`/task/${taskOne._id}`)
        .expect(401);
});

test('Should not fetch other users task by id', async() => {
    const response = await request(app)
        .get(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(400);
});


// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks