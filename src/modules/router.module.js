const CONFIG = require('../config/config');
const USER = require('../routes/user.route');

module.exports = app => {
  console.log('ROUTER MODULE STARTED');

  // app.use(CONFIG.uri_prefix, testRouter);
  app.use('/user', USER);
};