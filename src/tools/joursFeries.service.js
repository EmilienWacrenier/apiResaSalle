const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = 'Europe/Paris'; //UTC+01:00


const JOURS_FERIES = {};

JOURS_FERIES.today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone);

module.exports = JOURS_FERIES;
