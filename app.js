const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const CONFIG = require('./src/config/config');
const db = require('./src/config/db.config');

const PORT = CONFIG.port;

// winston logger
const {
  logger,
  expressLogger,
} = require('./src/config/winston.config');

app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors());

require('./src/modules/router.module')(app);

// Log Env
logger.info(`Environment: ${CONFIG.app}`);

// DATABASE
// db.sequelize
//   .authenticate()
//   .then(() => {
//     logger.info('Connection has been established successfully.');
//   })
//   .catch(err => {
//     logger.error('Unable to connect to the database:', err.message);
//   });

// Sync Database
db.sequelize.sync().then(function() {
  console.log('Sync has been established successfully.');
}).catch(function(err) {
  console.log('Unable to connect to the database:', err.message);
});

app.listen(PORT, ()=> {
  if (CONFIG.app === 'local') {
    logger.info(`PVC SERVER STARTED ON ${PORT}`);
  }
});

//Implémentation de Nodemailer pour l'envoi de mails d'invitation à la réunion
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
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


module.exports = app;
