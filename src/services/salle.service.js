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

module.exports.get_salle = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                id
            } = params; //params du header
            const salle = await salleBuilder.findSalle(id);
            return resolve({ code: 200, result: salle });
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
