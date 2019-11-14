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
