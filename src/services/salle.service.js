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
//get les salles occupées entre startDate et endDate
module.exports.get_salles_booked_between = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sallesBookedToday = await salleBuilder.findSallesBookedBetween(req);
            resolve(sallesBookedToday);
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
