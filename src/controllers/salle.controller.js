const salleService = require('../services/salle.service');
//get all salles
exports.getSalles = async (req, res) => {
        let data = await salleService.get_salles();
        return res.status(200).json(data);
};
//get 1 salle by id
exports.getSalle = async (req, res) => {
        let data = await salleService.get_salle(req.params);
        return res.status(200).json(data);
};
//get salles booked today
exports.getSallesBookedToday = async (req, res) => {
  let data = await salleService.get_salles_booked_today();
  return res.status(200).json(data);
}
