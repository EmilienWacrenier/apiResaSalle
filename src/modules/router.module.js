const CONFIG = require('../config/config');
const USER = require('../routes/user.route');
const salle = require('../routes/salle.route');

module.exports = app => {
  console.log('ROUTER MODULE STARTED');

  // app.use(CONFIG.uri_prefix, testRouter);
  app.use('/user', USER);

  //Salles
  app.use('/salles', salle);

};
