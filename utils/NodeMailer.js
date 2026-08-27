import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({

    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    

    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"ServiceHub" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent:", info.messageId);

    } catch (error) {
        console.error("Email sending error:", error);
        throw error;
    }
};

export default sendEmail;