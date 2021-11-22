const nodemailer = require("nodemailer");

let testAccount;
let transporter;

function createAccount() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // testAccount = await nodemailer.createTestAccount();

    // console.log(testAccount)

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.USER_NAME, // generated ethereal user
            pass: process.env.USER_PASSWORD //generated ethereal password
        }
    });
}

// async..await is not allowed in global scope, must use a wrapper
async function sendWelcomeEmail(email, name) {

    if (!transporter) {
        createAccount();
    }

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <anshikaagrawal5501@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<h1>Hello ${name}</h1>`, // html body
    });

    // console.log("Message sent: %s", info);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    // transporter.verify(function(error, success) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log("Server is ready to take our messages");
    //     }
    // });
}

async function sendCancellationEmail(email, name) {

    if (!transporter) {
        createAccount();
    }

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <anshikaagrawal5501@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Bye ✔", // Subject line
        text: "Bye world?", // plain text body
        html: `<h1>Bye ${name}</h1>`, // html body
    });

    // console.log("Message sent: %s", info);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    // transporter.verify(function(error, success) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log("Server is ready to take our messages");
    //     }
    // });
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}