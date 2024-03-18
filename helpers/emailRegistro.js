import nodemailer from "nodemailer";
import sgMail from '@sendgrid/mail';


const emailRegistro = async (datos) =>{
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
//     subject: "Comprueba tu cuenta en APV",
//     text: "Comprueba tu cuenta en APV",
//     html:`<p> Hola ${nombre}, comprueba tu cuenta en APV </p>
//         <p> Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
//         <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a></p>
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
      subject: 'Comprueba tu cuenta en APV',
      text: 'Comprueba tu cuenta en APV',
      html: `<p> Hola ${nombre}, comprueba tu cuenta en APV </p>
              <p> Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
              <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a></p>
              <p> Si no creaste esta cuenta, puedes ignorar este mensaje</p>
          `,
    };
    console.log(msg);
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default emailRegistro;
