const nodemailer = require("nodemailer");

const sendMail = async function (options) {
  try {
    const transport = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    console.log(transport, options);

    const transpoter = nodemailer.createTransport(transport);

    const message = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.to ,
      subject: options.subject,
      text: options.text,
    };

    await transpoter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
  return 
};

module.exports = sendMail;
