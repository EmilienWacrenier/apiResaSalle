const db = require('../config/db.config');
const Op = require('Sequelize').Op;

module.exports.findSalles = function () {
    return new Promise(async (resolve, reject) => {
        try {
            const salles = await db.models.Salle.findAll();
            resolve(salles);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.findSalle = function (req) {
    return new Promise(async (resolve, reject) => {
        try {
            const salle = await db.models.Salle.findOne(
                {
                    where: {
                        id_salle: req.body.salleId
                    }
                }
            );
            resolve(salle);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.findSallesAvailable = function (query) {
    return new Promise(async (resolve, reject) => {
        return resolve({'res':'resultat'})
    })
}
