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
