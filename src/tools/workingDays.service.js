const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = 'Europe/Paris'; //UTC+01:00
const momentE = require('moment-easter');

// Jours Fériés

module.exports.is_working_day = () => {
    return new Promise(async (resolve, reject) => {
        try {
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
            const joursFeries = {
                "Jour de l'an": jourDeLAn,
                "Paques": paques,
                "Lundi de Pâques": lundiDePaques,
                "Fête du Travail": feteDuTravail,
                "Victoire des Alliés": victoireDesAllies,
                "Ascension": ascension,
                "Lundi de Pentecôte": pentecote,
                "Fête Nationale": feteNationale,
                "Assomption": assomption,
                "Toussaint": toussaint,
                "Armistice": armistice,
                "Noël": noel
            };
            return resolve({ code: 200, result: joursFeries });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
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
