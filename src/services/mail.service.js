const CONFIG = require('../config/config');
const nodemailer = require('nodemailer');

//Implémentation de Nodemailer pour l'envoi de mails d'invitation à la réunion
var transporter = nodemailer.createTransport({
    host: CONFIG.transporter.host,
    port: CONFIG.transporter.port,
    proxy: CONFIG.transporter.proxy,
    secure: CONFIG.transporter.secure,
    auth: CONFIG.transporter.auth
});
// Envoi d'un mail aux participants
    //Configuration du message
    // var message = {
    //     from: CONFIG.message.from,
    //     to: req.body.senderEmail,
    //     subject: 'Réunion ' + req.body.objet + '    [NO-REPLY]',
    //     text: CONFIG.message.text,
    //     html: CONFIG.message.html,
    //     dsn: {
    //         id: CONFIG.message.dsn.id,
    //         return: CONFIG.message.dsn.return,
    //         notify: CONFIG.message.dsn.notify,
    //         recipient: req.body.senderEmail
    //     },
    // };
        // Envoi du mail
//Verification de la configuration de la Connection
// mailService.transporter.verify(function(error, success) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Le serveur est prêt à prendre nos messages");
//         mailService.transporter.sendMail(mailService.message, function(error,info){
//             if(error) {
//                 return console.log(error);
//             }
//             console.log('Message sent: ' + info.response);
//         });
//     }
// });
// mailService.transporter.close();
