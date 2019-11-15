const salleService = require('../services/salle.service');

exports.getSalles = async (req, res) => {
    let data = await salleService.get_salles();
    return res.status(200).json(data);
};

exports.getSalle = async (req, res) => {
    let data = await salleService.get_salle(req.params);
    return res.status(200).json(data);
};

exports.getSallesAvailable = async(req, res) => {
    let data = await salleService.get_salles_available(req.query);
    return res.status(data.code).json({result:data.result})
}