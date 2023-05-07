import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, name, message } = req.body;

     // Configure Nodemailer transporter
     const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'documentmycode@gmail.com', // Replace with your Gmail address
          pass: 'tydtqxbfexvorprz', // Replace with your Gmail password or App password
        },
      });

    // Send the email
    try {
        await transporter.sendMail({
            from: "documentmycode@gmail.com", // Keep this as your Gmail address
            replyTo: email, // Add the user's email as the reply-to address
            to: "documentmycode@gmail.com",
            subject: `New message from ${name}`,
            text: message,
          });

      res.status(200).json({ status: "Email sent" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ status: "Error sending email" });
    }
  } else {
    res.status(405).json({ status: "Method not allowed" });
  }
}
