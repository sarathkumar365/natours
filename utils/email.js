const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sarath kumar <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1. Render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../starter/views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2. Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3.Create a transport

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to natours');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password resset token . Valid upto 10 minutes'
    );
  }
};

// const sendEmail = async (options) => {
//   // 1. Create a transport
//   // const transporter = nodemailer.createTransport({
//   //   host: process.env.EMAIL_HOST,
//   //   port: process.env.EMAIL_PORT,
//   //   auth: {
//   //     user: process.env.EMAIL_USERNAME,
//   //     pass: process.env.EMAIL_PASSWORD,
//   //   },
//   // });
//   // 2. Define email options_
//   // const mailOptions = {
//   //   from: 'Sarath Kumar <hello@sarath@gmail.com>',
//   //   to: options.email,
//   //   subject: options.subject,
//   //   text: options.message,
//   //   //html:
//   // };
//   // 3. Send the email
// };

// module.exports = sendEmail;
