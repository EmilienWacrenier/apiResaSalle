const CONFIG = require('../config/config');
const userBuilder = require('../builders/user.builder');
const salleBuilder = require('../builders/salle.builder');
const nodemailer = require('nodemailer');
const moment = require('moment');

//Implémentation de Nodemailer pour l'envoi de mails d'invitation à la réunion
//définition du transporteur
let transporter = nodemailer.createTransport({
    host: CONFIG.transporter.host,
    port: CONFIG.transporter.port,
    proxy: CONFIG.transporter.proxy,
    secure: CONFIG.transporter.secure,
    // auth: CONFIG.transporter.auth
});
// Envoi d'un mail aux participants
module.exports.send_mail = (req) => {
    //Récupération des parametres de requete
    const senderId = req.body.userId;
    const recieversIds = req.body.users;
    const object = req.body.object;
    const startDate = req.body.startDate;
    const startTime = moment(startDate).format('HH:mm');
    const roomId = req.body.roomId;
    //Récupération des données
    //sender
    const req2 = {
        query: {
            userId: senderId
        }
    };
    const sender = userBuilder.findUserById(req2);
    const senderMail = sender.email;
    //recievers
    const recieversMail = [];
    for (const idUser of recieversIds) {
        req3 = {
            query: {
                userId: idUser
            }
        }
        let participant = userBuilder.findUserById(req3);
        recieversMail.push(participant.email);
    };
    console.log(recieversMail);
    //room
    const room = salleBuilder.findSalle(roomId);
    const roomName = room.nom;
    //verification du smtp
    if (!this.verifiy_smtp()) {
        return console.log('SMTP error');
    };
    if (!sender||!recievers||!object||!startDate||!startTime||!roomName) {
        return console.log('Il manque un paramètre');
    };
    let sendMail = transporter.sendMail(this.mail_config(senderMail, recieversMail, object, startDate, startTime, roomName), function(error,info){
        if(error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
    return sendMail;
};
//Configuration du message
module.exports.mail_config = (sender, recievers, object, startDate, startTime, room) => {
    let mailOptions = {
        from : CONFIG.mail.from,
        to: sender,// user qui crée la réservation
        envelope: {
            from: sender,// user qui crée la réservation
            to: recievers,// participants invités
            cc: sender// user qui crée la réservation
        },
        subject: 'Réunion : ' + object,
        text: sender + ' vous invite à la réunion ' + object + ' du : ' + startDate + ' à : ' + startTime + ', dans la salle : ' + room + '.',
        html: CONFIG.mail.html,
        dsn: {
            id: CONFIG.mail.dsn.id,
            return: CONFIG.mail.dsn.return,
            notify: CONFIG.mail.dsn.notify,
            recipient: sender
        }
    };
    return mailOptions;
};
//Verification de la configuration de la Connection
module.exports.verifiy_smtp = () => {
    let verifySMTP = transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Le serveur est prêt à prendre nos messages");
        }
    });
    return verifySMTP;
};


// mailService.transporter.close();
