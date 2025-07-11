import nodemailer from "nodemailer";

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export default async function sendEmail({ to, subject, html }: EmailOptions) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Treck" <${process.env.EMAIL_USERNAME}>`,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }
}
