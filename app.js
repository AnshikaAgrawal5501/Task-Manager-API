const mondodb = require('mongodb');

const MongoClient = mondodb.MongoClient;
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log('error');
    } else {

        const db = client.db(databaseName);
        // db.collection('users').insertOne({
        //     name: 'Anshika',
        //     age: 20,
        // });

        db.collection('tasks').insertMany([{
                task: 'wake up',
                isCompleted: true,
            },
            {
                task: 'brush teeth',
                isCompleted: true,
            },
            {
                task: 'Bath',
                isCompleted: false,
            }
        ], (error, result) => {
            if (error) {
                console.log('error');
            } else {
                console.log(result);
            }
        });
    }
});