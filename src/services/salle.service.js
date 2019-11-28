const salleBuilder = require('../builders/salle.builder');

module.exports.get_salles = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const salles = await salleBuilder.findSalles();
            return resolve({ code: 200, result: salles });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_salle = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salle = await salleBuilder.findSalle(req.query.roomId);
            return resolve({ code: 200, result: salle });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.get_salles_available = (req) => {
    return new Promise(async (resolve, reject) => {
        const salles = await salleBuilder.findSallesAvailable(req)
            .then(function (salles) {
                return resolve({ code: 200, result: salles });
            })
    });
}

module.exports.create_room = (req) => {
    return new Promise(async (resolve, reject) => {
        // Vérification des champs
        if (req.body.name == null || req.body.area == null, req.body.capacity == null) {
            return resolve({ code: 400, result: 'Un champs est null' })
        }
        const newRoom = await salleBuilder.createRoom(
            req.body.name,
            req.body.area,
            req.body.capacity
        ).then(function (newRoom) {
            if (newRoom != null) {
                return resolve({ code: 200, result: newRoom });
            }
        }).catch(function (err) {
            return reject(err)
        })
    })
}

module.exports.modify_room = (req) => {
    return new Promise(async (resolve, reject) => {
        if (req.body.name == null || req.body.area == null, req.body.capacity == null ||
            req.body.roomId == null) {
            return resolve({ code: 400, result: 'Un champs est null' })
        }
        const updatedRoom = await salleBuilder.modifyRoom(
            req.body.name,
            req.body.area,
            req.body.capacity,
            req.body.roomId
        ).then(function(updatedRoom){
            if(updatedRoom != null){
                return resolve({code: 200, result: 'Mise à jour correcte'});
            }
        }).catch(function(err){
            return reject(err);
        })
    })
}