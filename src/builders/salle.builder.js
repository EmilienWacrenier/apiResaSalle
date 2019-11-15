const db = require('../config/db.config');
const Op = require('Sequelize').Op;

//Trouver toutes les Salles
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

//Trouver 1 Salle par id
module.exports.findSalle = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            const salle = await db.models.Salle.findOne(
                {
                    where: {
                        id_salle: id
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
