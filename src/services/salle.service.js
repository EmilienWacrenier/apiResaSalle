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
//get les salles occupées (par journée)
module.exports.get_salles_booked_today = function () {
  return new Promise(async (resolve, reject) => {
    try {
        const today = new Date();
        console.log(today);
        const tomorrow = new Date();
        tomorrow.setHours(today.getHours()+12);
        console.log(tomorrow);
      const sallesBookedToday = await salleBuilder.findSallesBookedToday(today,tomorrow);
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
