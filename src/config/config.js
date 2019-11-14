const dotenv = require('dotenv');
const util = require('../tools/util.service');

// ENVIRONMENT = local || dev || prod || recette
const envFile = process.env.ENVIRONMENT ?
  `.env.${process.env.ENVIRONMENT}` :
  '.env.local';
dotenv.config({
  path: envFile
});

const CONFIG = {}; // Make this global to use all over the application

CONFIG.app = process.env.APP;
CONFIG.port = process.env.PORT;

CONFIG.log_path = 'log';
CONFIG.log_level = 'info';
CONFIG.log_level_exceptions = 'debug';

CONFIG.db_dialect = process.env.DB_DIALECT;
CONFIG.db_host = process.env.DB_HOST;
CONFIG.db_port = process.env.DB_PORT;
CONFIG.db_name = process.env.DB_NAME;
CONFIG.db_user = process.env.DB_USER;
CONFIG.db_password = process.env.DB_PASSWORD;

// Envoi du mail de récap: config du transporter
CONFIG.transporter = {
        host: 'smtp.gmail.com',
        port: 465,
        proxy: 'http://proxy-host:193.56.47.20:8080',
        secure: true,
        auth: {
            user: 'paprikaatos@gmail.com',
            pass: 'Paprika123456'
        }
};
// Envoi du mail de récap: config du message
CONFIG.message = {
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

// Timezone
CONFIG.timezone = util.getTimezone();


module.exports = CONFIG;
