const salleBuilder = require('../builders/salle.builder');

module.exports.get_salles = () => {
  return new Promise(async (resolve, reject) => {
    const salles = await salleBuilder.findSalles();
    resolve(salles);
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
