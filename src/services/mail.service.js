const CONFIG = require('../config/config');
const userBuilder = require('../builders/user.builder');
const salleBuilder = require('../builders/salle.builder');
const nodemailer = require('nodemailer');
const moment = require('moment');
var handlebars = require('handlebars');
var fs = require('fs');

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
//Lecture du template du mail
var readHTMLFile = (path, callback) => {
    fs.readFile(path, {
        encoding: 'utf-8'
    }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};
//configuration du mail (version avec template 2)
module.exports.mail_config = (senderMail, recieversMail, object, htmlToSend) => {
    var mailOptions = {
        from: CONFIG.transporter.auth.user,
        to: CONFIG.transporter.auth.user,
        cc: recieversMail,
        subject: 'Réunion : ' + object,
        html: htmlToSend, //remplace {path: htmlTemplatePath}
        attachments: [{
            filename: 'atos-logo.png',
            path: './src/tools/mails/atos-logo.png',
            contentDisposition: 'inline',
            cid: 'atosLogo'
        }, ],
        dsn: {
            id: CONFIG.mail.dsn.id,
            return: CONFIG.mail.dsn.return,
            notify: CONFIG.mail.dsn.notify,
            recipient: senderMail
        }
    };
    console.log('Test mailOptions : ');
    console.log('from : ' + mailOptions.from);
    console.log('to : ' + mailOptions.to);
    console.log('subject : ' + mailOptions.subject);
    console.log('html path : ' + mailOptions.html.path);
    return mailOptions;
};
//Verification de la configuration de la Connection
module.exports.verifiy_smtp = () => {
    let verifySMTP = transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log("Le serveur est prêt à prendre nos messages");
            return verifySMTP;
        }
    });
};
// Envoi d'un mail aux participants
module.exports.send_mail = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Récupération des parametres de requete
            const senderId = req.body.userId;
            const recieversIds = req.body.users;
            const object = req.body.object;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const roomId = req.body.roomId;
            const htmlTemplate = 'invitation.html'; //mettre un if param existe alors template =...
            //Vérification des parametres
            console.log('senderId (dans send_mail) : ' + senderId);
            console.log('recieversIds (dans send_mail) : ' + recieversIds);
            console.log('object (dans send_mail) : ' + object);
            console.log('startDate (dans send_mail) : ' + startDate);
            console.log('endDate (dans send_mail) : ' + endDate);
            console.log('roomId (dans send_mail) : ' + roomId);
            console.log('htmlTemplate (dans send_mail) : ' + htmlTemplate);
            //Manipulation des paramètres récupérés
            const startDateLetter = moment(startDate).format('dddd D MMMM YYYY');
            const startTime = moment(startDate).format('HH:mm');
            const endTime = moment(endDate).format('HH:mm');
            const htmlTemplatePath = 'src/tools/mails/' + htmlTemplate;
            //Vérification
            console.log('startDateLetter (dans send_mail) : ' + startDateLetter);
            console.log('startTime (dans send_mail) : ' + startTime);
            console.log('endTime (dans send_mail) : ' + endTime);
            console.log('htmlTemplatePath (dans send_mail) : ' + htmlTemplatePath);
            //Récupération des données en base
            //senderName et senderMail avec senderId
            const req2 = {
                query: {
                    userId: senderId
                }
            };
            const sender = await userBuilder.findUserById(req2);
            console.log('sender : ' + sender);
            const senderMail = sender.email;
            const senderFullName = sender.firstName + ' ' + sender.lastName;
            //recieversMail avec recieversIds
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
            //roomName avec roomId
            const room = await salleBuilder.findSalle(roomId);
            const roomName = room.name;

            //Verification des données récupérées
            console.log('mail du sender (dans send_mail) : ' + senderMail);
            console.log('nom complet du sender (dans send_mail) : ' + senderFullName);
            console.log('mails des recievers (dans send_mail) : ' + recieversMail);
            console.log('nom de la salle (dans send_mail) : ' + roomName);
            console.log('objet de la réunion (dans send_mail) : ' + object);
            // if (!senderMail||!recieversMail||!object||!startDate||!startTime||!roomName) {
            //     return console.log('Il manque un paramètre');
            // };
            //Test avec template et handlebars
            readHTMLFile(htmlTemplatePath, (err, html) => {
                var template = handlebars.compile(html);
                var replacements = {
                    object: object,
                    date: startDateLetter,
                    startTime: startTime,
                    endTime: endTime,
                    senderFullName: senderFullName,
                };
                var htmlToSend = template(replacements);
                const mailOptions = this.mail_config(senderMail, recieversMail, object, htmlToSend);
                var sendMail = transporter.sendMail(mailOptions, async (error, info) => {
                    //verification du smtp
                    // var verifySMTP = await this.verifiy_smtp();
                    // if (!verifySMTP) {
                    //     console.log('SMTP error !!');
                    // };
                    if (!error) {
                        console.log('Message sent: ' + info.response);
                        transporter.close();
                    } else {
                        console.log(error);
                        transporter.close();
                        return error;
                    }
                    // return resolve({ code: 200, result: sendMail });
                    return resolve({
                        code: 200,
                        result: sendMail
                    });
                });
            });
        } catch (err) {
            return resolve({
                code: 500,
                result: err
            });
        }
    });
};


// Envoie un mail pour confirmer l'inscription 
module.exports.send_mail_inscription = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let mailConfig = {
                target: req.body.email,
                subject: 'Confirmation de création de compte EKLA',
                html: `<b>Hello ${req.body.firstName}</b>` + `<br> <br> Bienvenue, et merci pour ton inscription, vous pouvez dès à présent vous connecter`
            };

            var transporter = nodemailer.createTransport({
                host: CONFIG.transporter.host,
                secureConnection: CONFIG.transporter.secureConnection,
                port: CONFIG.transporter.port,
                auth: {
                    user: CONFIG.transporter.auth.user,
                    pass: CONFIG.transporter.auth.pass
                },
                requireTLS: true,
                tls: CONFIG.transporter.tls
            });

            var mailOptions = {
                from: CONFIG.transporter.auth.user,
                to: mailConfig.target,
                subject: mailConfig.subject,
                html: mailConfig.html
            };

            var sendMail = transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    transporter.close();
                    return error, 'L\'envoi de mail pour la confirmation de création de compte n\'a pas pu aboutir';
                }
                console.log('Message sent: ' + info.response)
                console.log('Envoi du mail avec succès');
            });
            
            return resolve({
                code: 200,
                result : sendMail
            });

        } catch (err) {
            return resolve({
                code: 500,
                result: err
            });
        }
    });
};
