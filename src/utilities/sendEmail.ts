import Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: 'sandbox00677204529847c990a4766117763cc4.mailgun.org'
});

const sendEmail = (to: string, subject: string, html: string) => {
  const emailData = {
    to,
    subject,
    html,
    from: 'egoomoy@gmail.com'
  };
  return mailGunClient.messages().send(emailData);
};

export const sendWelcomeEmail = (to: string, code: string) => {
  const emailSubject = `Welcome please verify your email`;
  const emailBody = `<a href="http://epic.io/${code}>Click Here</a>"`;
  return sendEmail(to, emailSubject, emailBody);
};
