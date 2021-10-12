const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



// const me = new user({
//     Name: 'Anshika',
//     Email: 'anshikaagrawal5501@gmail.com',
//     Password: '123anshika',
//     Age: 21
// });

// me.save().then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.log(error);
// });



// const task1 = new task({
//     Description: 'Wake up',
//     Completed: true,
// });

// task1.save().then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.log(error);
// });