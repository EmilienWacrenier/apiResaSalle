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
//get salle by id lié à une réservation aujourd'hui
exports.getSallesBookedBetweenById = async (req,res) => {
    let data = await salleService.get_salles_booked_between_by_id(req);
    return res.status(200).json(data);
}
//get salles booked between
exports.getSallesBookedBetween = async (req, res) => {
    let data = await salleService.get_salles_booked_between(req);
    return res.status(200).json(data);
}

//get salles réservées aujourd'hui
// exports.getSallesBookedToday = async (req,res) => {
//     let data = await salleService.get_salles_booked_today();
//     return res.status(200).json(data);
// }
