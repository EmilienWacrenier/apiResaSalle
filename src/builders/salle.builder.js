const db = require('../config/db.config');
const Op = require('Sequelize').Op;

module.exports.findSalles = function () {
    return new Promise(async (resolve, reject) => {
        try {
            const salles = await db.models.Room.findAll();
            resolve(salles);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.findSalle = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            const salle = await db.models.Room.findOne({
                where: {
                    roomId: id
                }
                });
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
