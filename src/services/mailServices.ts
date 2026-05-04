import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
        from: `"EOS Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Réinitialisation de votre mot de passe - EOS',
        html: `<h2>Bonjour,</h2>
               <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
               <p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
               <a href="${resetUrl}">${resetUrl}</a>
               <p>Ce lien est valable pendant 1 heure.</p>
               <p> Si vous n'etes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
               <p>Cordialement,</p>
               <p>L'équipe EOS</p>`,
    };

    await transporter.sendMail(mailOptions);
}