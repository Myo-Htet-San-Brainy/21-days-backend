const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendReminderEmail = async (name, email, reminderMessage) => {
  const body = `Hi ${name},<p>
  ${reminderMessage}
  </p>`;
  const msg = {
    to: email, // Change to your recipient
    from: "myohtetsandrinksmilk@gmail.com", // Change to your verified sender
    subject: "21days Habit Reminder",
    html: body,
  };
  await sgMail.send(msg);
};

module.exports = sendReminderEmail;
