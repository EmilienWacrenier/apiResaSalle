const salleService = require('../services/salle.service');

exports.getSalles = async (req, res) => {
        let data = await salleService.get_salles();
        return res.status(200).json(data);
};

exports.getSalle = async (req, res) => {
        let data = await salleService.get_salle(req.params);
        return res.status(200).json(data);
};
