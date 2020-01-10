const salleBuilder = require('../builders/salle.builder');
const reservationBuilder = require('../builders/reservation.builder');
const general = require('./general.service');

//obtenir les salles
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

//obtenir 1 salle
module.exports.get_salle = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedParams = general.checkParam(req, ["roomId"]);
            if (checkedParams != null) {
                return resolve(checkedParams);
            }
            const salle = await salleBuilder.findSalle(req.query.roomId);
            return resolve({ code: 200, result: salle });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

//obtenir les salles disponibles
module.exports.get_salles_available = (req) => {
    return new Promise(async (resolve, reject) => {
        // Vérification paramètres 
        const checkedParams = general.checkParam(req, ["capacity", "startDate", "endDate"])
        if (checkedParams != null) {
            return resolve(checkedParams);
        }
        if (isNaN(req.query.capacity)) {
            return resolve({ code: 400, result: 'Capacity n\'est pas un nombre' })
        }
        if (req.query.label == null ||
            req.query.endDateRecurrence == null) {
            const salles = await salleBuilder.findSallesAvailable(req)
                .then(function (salles) {
                    return resolve({ code: 200, result: salles });
                })
        }
        else {
            /*const sallesByCapacity = await salleBuilder.findSalleByCapacity(req.query.capacity);
            var listReservationConflict = [];
            const endDateRecurrence = new Date(req.query.endDateRecurrence)
            sallesByCapacity.forEach(async salle => {
                let currentId = sallesByCapacity.roomId;
                let currentStartDate = new Date(req.query.startDate);
                let currentEndDate = new Date(req.query.endDate);
                let conflictReservation = []
                while (currentEndDate < endDateRecurrence) {
                    let currentResa = await reservationBuilder.findReservationByRoomByDate(salle.dataValues.roomId,
                        currentStartDate, currentEndDate)
                    if (currentResa != null) {
                        conflictReservation.push(currentResa)
                        console.log(conflictReservation)
                    }
                    
                    currentStartDate.setDate(currentStartDate.getDate() + 1)
                    currentEndDate.setDate(currentEndDate.getDate() + 1)
                }
                salle.dataValues.conflict = "conflictReservation";
            });*/
            const sallesByCapacity = await reservationBuilder.findReservationByRoomByDate(
                4,
                new Date("2019-12-09 08:30:00"),
                new Date("2019-12-11 10:10:00")
            )
            return resolve({ code: 200, result: sallesByCapacity })
        }

    });
}



//creation d'une salle
module.exports.create_room = (req) => {
    return new Promise(async (resolve, reject) => {
        // Vérification des paramètres
        const checkedParams = general.checkParam(req, ["name", "area", "capacity"]);
        if (checkedParams != null) {
            return resolve(checkedParams)
        }
        if (isNaN(req.body.capacity)) {
            return resolve({
                code: 400,
                result: "capacity n'est pas un nombre"
            })
        }

        // Contrôler l'existance du nom pour éviter les doublons
        const existingRoom = await salleBuilder.findSalleByName(req.body.name)
        if (existingRoom != null) {
            return resolve({
                code: 400,
                result: "Ce nom de salle est déjà utilisé"
            })
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

//modification d'une salle
module.exports.modify_room = (req) => {
    return new Promise(async (resolve, reject) => {
        const checkedParams = general.checkParam(req, ["name", "area", "capacity", "roomId"])
        if (checkedParams != null) {
            return resolve(checkedParams)
        }
        if (isNaN(req.body.capacity)) {
            return resolve({
                code: 400,
                result: "Capacité n'est pas un nombre"
            })
        }
        // Contrôler l'existance du nom pour éviter les doublons
        const existingRoomByName = await salleBuilder.findSalleByName(req.body.name)
        if (existingRoomByName != null) {
            return resolve({
                code: 400,
                result: "Ce nom de salle est déjà utilisé"
            })
        }
        const existingRoomById = await salleBuilder.findSalle(req.body.roomId);
        if(existingRoomById == null){
            return resolve({
                code: 400,
                result: "La salle n'existe pas"
            })
        }

        const updatedRoom = await salleBuilder.modifyRoom(
            req.body.name,
            req.body.area,
            req.body.capacity,
            req.body.roomId
        ).then(function (updatedRoom) {
            if (updatedRoom != null) {
                return resolve({ code: 200, result: 'Mise à jour correcte' });
            }
        }).catch(function (err) {
            return reject(err);
        })
    })
}

//suppression d'une salle
module.exports.delete_room = (req) => {
    return new Promise(async (resolve, reject) => {
        const checkedParams = general.checkParam(req, ["roomId"])
        if (checkedParams != null) {
            return resolve(checkedParams);
        }

        const deleted = await salleBuilder.destroyRoom(req.query.roomId)
            .then(function (deleted) {
                // Vérification de la suppression
                if (deleted == 1) {
                    return resolve({ code: 200, result: 'Suppression correctement effectue' });
                }
                return resolve({ code: 400, result: 'Une erreur est survenue lors de la suppression' })
            }).catch(function (err) {
                return reject(err)
            })
    })
}
