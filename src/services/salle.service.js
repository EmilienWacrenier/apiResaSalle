const salleBuilder = require('../builders/salle.builder');
//get all salles
module.exports.get_salles = () => {
  return new Promise(async (resolve, reject) => {
    const salles = await salleBuilder.findSalles();
    resolve(salles);
  });
};
//get les salles occupées (par journée)
module.exports.get_salles_booked_today = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const sallesBookedToday = await salleBuilder.findSallesBookedToday();
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
    const {
      id
    } = params;
    const salle = await salleBuilder.findSalle(id);
    resolve(salle);
  });
};
