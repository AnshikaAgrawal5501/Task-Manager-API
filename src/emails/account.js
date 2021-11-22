const nodemailer = require("nodemailer");

let testAccount;
let transporter;

function createAccount() {

    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_NAME,
            pass: process.env.USER_PASSWORD
        }
    });
}

async function sendWelcomeEmail(email, name) {

    if (!transporter) {
        createAccount();
    }

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <anshikaagrawal5501@gmail.com>',
        to: email,
        subject: "Hello ✔",
        text: "Hello world?",
        html: `<h1>Hello ${name}</h1>
        <img src="cid:unique@nodemailer.com"/>
        `,
        attachments: [{
            filename: 'email_welcome.jpg',
            path: './public/images/email_welcome.jpg',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
    });
}

async function sendCancellationEmail(email, name) {

    if (!transporter) {
        createAccount();
    }

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <anshikaagrawal5501@gmail.com>',
        to: email,
        subject: "Bye ✔",
        text: "Bye world?",
        html: `<h1>Bye ${name}</h1>
        <img src="cid:unique@nodemailer.com"/>
        `,
        attachments: [{
            filename: 'email_welcome.jpg',
            path: './public/images/email_bye.jpg',
            cid: 'unique@nodemailer.com' //same cid value as in the html img src
        }]
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}