const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// To add back name, email, reminderMessage
const sendReminderEmail = async () => {
  //To delete
  const name = "Soung Oo Lwin";
  const email = "soungoolwin275@gmail.com";
  const reminderMessage = "hi mom!";

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
