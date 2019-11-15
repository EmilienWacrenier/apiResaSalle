const salleBuilder = require('../builders/salle.builder');

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

module.exports.get_salles_available = (query) => {
    return new Promise(async (resolve, reject) => {
        const salles = await salleBuilder.findSallesAvailable(query)
        .then(function(salles){
            console.log("dans then")
            return resolve({ code: 200, result: 'bobo' });
        })
    });
}
