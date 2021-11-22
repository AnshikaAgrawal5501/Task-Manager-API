const app = require('./app');

const port = process.env.PORT;

app.listen(port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
});