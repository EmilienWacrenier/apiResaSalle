const CONFIG = require('../config/config');

//Implémentation de Nodemailer pour l'envoi de mails d'invitation à la réunion
var transporter = nodemailer.createTransport({
    host: CONFIG.transporter.host,
    port: CONFIG.transporter.port,
    proxy: CONFIG.transporter.proxy,
    secure: CONFIG.transporter.secure,
    auth: {
        user: CONFIG.transporter.auth.user,
        pass: CONFIG.transporter.auth.pass
    }
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
    from: 'paprikaatos@gmail.com',
    to: req.body.senderEmail,
    {
        name: req.body.name,
        address: req.body.email
    },
    subject: 'Réunion ' + req.body.objet + '    [NO-REPLY]',
    text: 'Plain Text Message',
    html: '<p>HTML Text Message</p>',
    dsn: {
        id: 'successfully_sent',
        return: 'headers',
        notify:'success',
        recipient: req.body.senderEmail
    },
    {
        id: 'not_sent',
        return: 'headers',
        notify:['failure', 'delay'],
        recipient: req.body.senderEmail
    }
};
