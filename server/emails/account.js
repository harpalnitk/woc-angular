const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'harpalnitk@gmail.com',
    from: 'harpalnitk@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'harpalnitk@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}.Let me know how you get along with the app.`
    })
}
const sendCancellationEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'harpalnitk@gmail.com',
        subject: 'Sorry! to see you go',
        text: `Goodbye, ${name}. Please let us know the reasons for your leaving.Hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
