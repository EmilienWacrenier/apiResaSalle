const CONFIG = require('../config/config');
const userBuilder = require('../builders/user.builder');
const salleBuilder = require('../builders/salle.builder');
const nodemailer = require('nodemailer');
const moment = require('moment');

//Implémentation de Nodemailer pour l'envoi de mails d'invitation à la réunion
//définition du transporteur
let transporter = nodemailer.createTransport({
    host: CONFIG.transporter.host,
    secureConnection: CONFIG.transporter.secureConnection,
    port: CONFIG.transporter.port,
    // proxy: CONFIG.transporter.proxy,
    auth: {
        user: CONFIG.transporter.auth.user,
        pass: CONFIG.transporter.auth.pass
    },
    requireTLS: true,
    tls: CONFIG.transporter.tls
});
// Envoi d'un mail aux participants
module.exports.send_mail = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Récupération des parametres de requete
            const senderId = req.body.userId;
            const recieversIds = req.body.users;
            const object = req.body.object;
            const startDate = req.body.startDate;
            const startDateLetter = moment(startDate).format('dddd D MMMM YYYY');
            const startTime = moment(startDate).format('HH:mm');
            const roomId = req.body.roomId;
            //Vérification des parametres
            console.log(senderId);
            console.log(recieversIds);
            console.log(object);
            console.log(roomId);
            //Récupération des données
            //sender
            const req2 = {
                query: {
                    userId: senderId
                }
            };
            const sender = await userBuilder.findUserById(req2);
            console.log('sender : ' + sender);
            const senderMail = sender.email;
            const senderFullName = sender.firstName + ' ' + sender.lastName;
            //recievers
            const recieversMail = [];
            for (const idUser of recieversIds) {
                req3 = {
                    query: {
                        userId: idUser
                    }
                }
                let participant = await userBuilder.findUserById(req3);
                recieversMail.push(participant.email);
            };
            //room
            const room = await salleBuilder.findSalle(roomId);
            console.log('room : '  + room);
            const roomName = room.name;

            //Verification des parametre
            console.log('mail du sender : ' + senderMail);
            console.log('mails des recievers : ' + recieversMail);
            console.log('nom de la salle : ' + roomName);
            console.log('objet de la réunion : ' + object);
            console.log('date de la réunion : ' + startDateLetter);
            console.log('heure de la réunion : ' + startTime);
            // if (!senderMail||!recieversMail||!object||!startDate||!startTime||!roomName) {
            //     return console.log('Il manque un paramètre');
            // };

            const mailOptions = await this.mail_config(senderFullName, recieversMail, object, startDateLetter, startTime, roomName);
            console.log('Test mailOptions : ' + mailOptions);
            console.log('test transporter : ' + transporter);
            let sendMail = await transporter.sendMail(mailOptions, async (error,info) => {
                //verification du smtp
                // var verifySMTP = await this.verifiy_smtp();
                // if (!verifySMTP) {
                //     console.log('SMTP error !!');
                // };
                if(!error) {
                    console.log('Message sent: ' + info.response);
                } else {
                    console.log(error);
                    return error;
                }
                return resolve({ code: 200, result: sendMail });
            });
        }  catch (err) {
            return resolve({
                code: 500,
                result: err
            });
        }
});
};
//Configuration du message
module.exports.mail_config = (sender, recievers, object, startDateLetter, startTime, room) => {
    let mailOptions = {
        from : CONFIG.transporter.auth.user,
        to:  recievers, sender,
        subject: 'Réunion : ' + object,
        text: sender + ' vous invite à la réunion ' + object + ' du : ' + startDateLetter + ' à : ' + startTime + ', dans la salle : ' + room + '.',
        // html: CONFIG.mail.html,
        dsn: {
            id: CONFIG.mail.dsn.id,
            return: CONFIG.mail.dsn.return,
            notify: CONFIG.mail.dsn.notify,
            recipient: sender
        }
    };
    console.log('Test mailOptions : ' + mailOptions);
    return mailOptions;
};
//Verification de la configuration de la Connection
module.exports.verifiy_smtp = () => {
    let verifySMTP = transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log("Le serveur est prêt à prendre nos messages");
            return verifySMTP;
        }
    });
};


// mailService.transporter.close();
