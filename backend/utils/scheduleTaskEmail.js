const transporter = require("../config/mailer");

function scheduleTaskEmail({ email, title, deadline }) {
  console.log("🔥 scheduleTaskEmail CALLED", { email, title, deadline });

  if (!deadline) return;

  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate)) return;

//   // Send exactly at deadline (or subtract time here)
   const delay = deadlineDate.getTime() - Date.now();

//    console.log("⏳ Email delay (ms):", delay);

  if (delay <= 0) return;
 // const delay = 1 * 60 * 1000; 

 

  setTimeout(async () => {
    try {
      await transporter.sendMail({
        from: `"Task Manager" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `⏰ Task Reminder: ${title}`,
        html: `
          <h3>Task Reminder</h3>
          <p>
            <b>${title}</b> is due at 
            <b>${deadlineDate.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            })} (IST)</b>
          </p>
        `,
      });

      console.log("📧 Reminder email SENT:", email);
    } catch (err) {
      console.error("Email failed:", err);
    }
  }, delay);
}

module.exports = scheduleTaskEmail;
