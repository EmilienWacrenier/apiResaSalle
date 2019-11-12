const salleBuilder = require('../builders/salle.builder');
//get all salles
module.exports.get_salles = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const salles = await salleBuilder.findSalles();
            resolve(salles);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//Regex de la date au format YYYY-MM-DD HH:mm:ss
const DATE_REGEX = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
//get les salles occupées entre startDate et endDate
module.exports.get_salles_booked_between = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!req.body.startDate || !req.body.endDate) {
                reject("Il manque une startDate ou une endDate !")
            }
            if (DATE_REGEX.test(req.body.startDate) && DATE_REGEX.test(req.body.endDate)) {
                const sallesBookedToday = await salleBuilder.findSallesBookedBetween(req);
                resolve(sallesBookedToday);
            } else {
                reject("Les dates ne sont pas au bon format ! Utiliser le format TIMESTAMP : YYYY-MM-DD HH:mm:ss");
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//get salle by id
module.exports.get_salle = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                id
            } = params;
            const salle = await salleBuilder.findSalle(id);
            resolve(salle);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
