const salleService = require('../services/salle.service');
const REGEX = require('../tools/validation/regex').date;
const general = require('../services/general.service');


// GET
exports.getSalles = async (req, res) => {
    let data = await salleService.get_salles();
    return res.status(data.code).json({ result: data.result });
};

exports.getSalle = async (req, res) => {
    const checkedParams = general.checkParam(req, ["roomId"]);
    if (checkedParams != null) {
        return res.status(checkedParams.code).json({result: checkedParams.result});
    }
    if(isNaN(req.query.roomId)){
        return res.status(400).json({result: "roomId n'est pas un chiffre"});
    }
    let data = await salleService.get_salle(req);
    return res.status(data.code).json({ result: data.result });
};

exports.getSallesAvailable = async (req, res) => {
    const checkedParams = general.checkParam(req, ["capacity", "startDate", "endDate"])
    if (checkedParams != null) {
        return res.status(checkedParams.code).json({result: checkedParams.result});
    }
    if(!REGEX.test(req.query.startDate) || !REGEX.test(req.query.endDate)){
        return res.status(400).json({result: "Les dates ne sont pas au bon format"});
    }
    let data = await salleService.get_salles_available(req);
    return res.status(data.code).json({ result: data.result });
}


// POST
exports.createRoom = async (req, res) => {
    let data = await salleService.create_room(req);
    return res.status(data.code).json({result: data.result});
}


// PUT
exports.modifyRoom = async (req, res) => {
    let data = await salleService.modify_room(req);
    return res.status(data.code).json({result: data.result});
}


// DELETE
exports.deleteRoom = async (req, res) => {
    const checkedParams = general.checkParam(req, ["roomId"])
    if (checkedParams != null) {
        return res.status(checkedParams.code).json({result: checkedParams.result});
    }
    if (isNaN(req.query.roomId)){
        return res.status(400).json({result: "roomId n'est pas un nombre"})
    }
    let data = await salleService.delete_room(req);
    return res.status(data.code).json({result: data.result});
}