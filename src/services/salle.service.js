const salleBuilder = require('../builders/salle.builder');

module.exports.get_salles = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const salles = await salleBuilder.findSalles();
            return resolve({ code: 200, result: salles });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_salle = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salle = await salleBuilder.findSalle(req.query.roomId);
            return resolve({ code: 200, result: salle });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_salles_available = (req) => {
    return new Promise(async (resolve, reject) => {
        const salles = await salleBuilder.findSallesAvailable(req)
        .then(function(salles){
            return resolve({ code: 200, result: 'Route non fonctionnel' });
        })
    });
}
