const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = 'Europe/Paris'; //UTC+01:00
const momentE = require('moment-easter');

// Jour de week end
module.exports.is_week_end = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const testedDate = moment(req.body.startDate).format('YYYY-MM-DD');
            const testedDay = moment(testedDate).day();
            if (testedDay===0 || testedDay===6) {
                return resolve({code:200, result: testedDate + ' est un jour de week-end!'})
            } else {
                return resolve({code:200, result: testedDate + ' est un jour de semaine!'})
            };
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

// Jours Fériés
module.exports.is_ferie = (req) => {
    var listeFeries = this.liste_jours_feries();
    const testedDate = moment(req.body.startDate).format('YYYY-MM-DD');
    var result = listeFeries.some(ferie => ferie===testedDate);
    console.log(result + ' result dans is ferie');
    return result;
};
module.exports.liste_jours_feries = (req) => {
    const jourDeLAn = this.jour_de_l_an();
    const paques = this.paques();
    const lundiDePaques = this.lundi_de_paques();
    const feteDuTravail = this.fete_du_travail();
    const ascension = this.ascension();
    const victoireDesAllies = this.victoire_des_allies();
    const pentecote = this.pentecote();
    const feteNationale = this.fete_nationale();
    const assomption = this.assomption();
    const toussaint = this.toussaint();
    const armistice = this.armistice();
    const noel = this.noel();
    var joursFeries = [];
    joursFeries.push(jourDeLAn);
    joursFeries.push(paques);
    joursFeries.push(lundiDePaques);
    joursFeries.push(feteDuTravail);
    joursFeries.push(victoireDesAllies);
    joursFeries.push(ascension);
    joursFeries.push(pentecote);
    joursFeries.push(feteNationale);
    joursFeries.push(assomption);
    joursFeries.push(toussaint);
    joursFeries.push(armistice);
    joursFeries.push(noel);
    console.log(joursFeries + ' jours féries dans liste_jours_feries')
    return joursFeries;
};
//Calcul des jours féries
module.exports.paques = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const paques = momentE.easter(currentYear).format('YYYY-MM-DD');
    return paques;
};
module.exports.lundi_de_paques = () => {
    const lundiDePaques = moment(this.paques()).add(1,'days').format('YYYY-MM-DD');
    return lundiDePaques;
};
module.exports.ascension = () => {
    const ascension = moment(this.paques()).add(39,'days').format('YYYY-MM-DD');
    return ascension;
};
module.exports.pentecote = () => {
    const pentecote = moment(this.paques()).add(50,'days').format('YYYY-MM-DD');
    return pentecote;
};
module.exports.jour_de_l_an = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const jourDeLAn = moment(currentYear+'-01-01').format('YYYY-MM-DD');
    return jourDeLAn;
};
module.exports.fete_du_travail = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const feteDuTravail = moment(currentYear+'-05-01').format('YYYY-MM-DD');
    return feteDuTravail;
};
module.exports.victoire_des_allies = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const victoireDesAllies = moment(currentYear+'-05-08').format('YYYY-MM-DD');
    return victoireDesAllies;
};
module.exports.fete_nationale = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const feteNationale = moment(currentYear+'-07-14').format('YYYY-MM-DD');
    return feteNationale;
};
module.exports.assomption = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const assomption = moment(currentYear+'-08-15').format('YYYY-MM-DD');
    return assomption;
};

module.exports.toussaint = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const toussaint = moment(currentYear+'-11-01').format('YYYY-MM-DD');
    return toussaint;
};

module.exports.armistice = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const armistice = moment(currentYear+'-11-11').format('YYYY-MM-DD');
    return armistice;
};

module.exports.noel = () => {
    const today =  momentTz.tz(new Date(),'YYYY-MM-DD HH:mm:ss',timeZone); //date d'aujourd'hui au format YYYY-MM-DD HH:mm:ss + timezone
    const currentYear = today.year();
    const noel = moment(currentYear+'-12-25').format('YYYY-MM-DD');
    return noel;
};
