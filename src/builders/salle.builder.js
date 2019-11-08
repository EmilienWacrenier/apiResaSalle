const db = require('../config/db.config');

//Trouver toutes les Salles
module.exports.findSalles = function () {
  return new Promise(async (resolve, reject) => {
      const salles = await db.models.Salle.findAll();
      resolve(salles);
  });
};
//Trouver les salles associées à une résa pour le jour courant
module.exports.findSallesBookedToday = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const today = new Date();
      const sallesBookedToday = await db.models.Salle.findAll({
        include: [{
          model: db.models.Reservation,
          where: {
            dateDebut: today,
            etat: 1,
          }
        }
        ]
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
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
