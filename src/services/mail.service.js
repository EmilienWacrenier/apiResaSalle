const CONFIG = require('../config/config');

//Implémentation de Nodemailer pour l'envoi de mails d'invitation à la réunion
var transporter = nodemailer.createTransport({
    host: CONFIG.transporter.host,
    port: CONFIG.transporter.port,
    proxy: CONFIG.transporter.proxy,
    secure: CONFIG.transporter.secure,
    auth: CONFIG.transporter.auth
});
//Verification de la configuration de la Connection
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Le serveur est prêt à prendre nos messages");
    }
});
//Configuration du message
var message = {
    from: CONFIG.message.from,
    to: CONFIG.message.to,
    subject: CONFIG.message.subject,
    text: CONFIG.message.text,
    html: CONFIG.message.html,
    dsn: CONFIG.message.dsn
};
