import nodemailer from "nodemailer";
import sgMail from '@sendgrid/mail';

const emailOlvidePassword = async (datos) =>{
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS
//         }
//       });
// //Enviar el email
// const {email,nombre,token} = datos;

// const info = await transporter.sendMail({
//     from: "APV - Administrador de Pacientes de Veterinaria",
//     to: email,
//     subject: "Reestablece tu password",
//     text: "Reestablece tu password",
//     html:`<p> Hola ${nombre}, Has solicitado reestablecer tu password </p>
//         <p> Sigue el siguiente enlace para generar un nuevo password:
//         <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a></p>
//         <p> Si no creaste esta cuenta, puedes ignorar este mensaje</p>
//     `
// });

// console.log('Mensaje enviado :'+ info.messageId);
try {
  const {email,nombre,token} = datos;
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, // Change to your recipient
    from: process.env.SENDER_EMAIL, // Change to your verified sender
    subject: 'Reestablece tu password',
    text: 'Reestablece tu password',
    html: `<p> Hola ${nombre}, Has solicitado reestablecer tu password </p>
            <p> Sigue el siguiente enlace para generar un nuevo password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a></p>
            <p> Si no creaste esta cuenta, puedes ignorar este mensaje</p>
         `
  };
  console.log(msg);
  await sgMail.send(msg);
  console.log('Email sent');
} catch (error) {
  console.error('Error sending email:', error);
}
}

export default emailOlvidePassword;
