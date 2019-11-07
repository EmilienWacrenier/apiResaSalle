const db = require('../config/db.config');
//Trouver toutes les Salles
module.exports.findSalles = function () {
    return new Promise(async (resolve, reject) => {
        const salles = await db.models.Salle.findAll();
        resolve(salles);
    });
  };
//Trouver 1 Salle par id
  module.exports.findSalle = function (id) {
    return new Promise(async (resolve, reject) => {
        const salle = await db.models.Salle.findOne(
          {
            where: {
              id: id
            }
          }
        );
        resolve(salle);
    });
  };
