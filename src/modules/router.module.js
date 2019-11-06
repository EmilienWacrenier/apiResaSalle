const CONFIG = require('../config/config');
const salle = require('../routes/salle.route');

module.exports = app => {
  console.log('ROUTER MODULE STARTED');

  //Salle
  app.use('/salles', salle);

};
