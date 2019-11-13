//Implémentation de Nodemailer pour l'envoi de mails d'invitation à la réunion
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    proxy: 'http://proxy-host:193.56.47.20:8080',//mettre dans config
    secure: true,
    auth: {
        user: 'paprikaatos@gmail.com',
        pass: 'Paprika123456'
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
