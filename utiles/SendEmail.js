const nodemailer = require("nodemailer");

const SendEmail = async (options) => {
  //1-  //1-create transport (transport is services that will send email like(gmail,mailgun,mailtrap))
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2-define Email options (like to from subject )
  const EmailOption = {
    from: "smart-note-app <moustafafattouh55@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3-send email
  await transport.sendMail(EmailOption);
};

module.exports = SendEmail;
