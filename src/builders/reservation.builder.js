const db = require('../config/db.config');
const Op = require('Sequelize').Op;


// GET
module.exports.findReservations = function () {
    return new Promise(async (resolve, reject) => {
        try {
            const reservations = await db.models.Reservation.findAll();            
            resolve(reservations);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.findReservationById = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            const reservationById = await db.models.Reservation.findOne(
                {
                    where: {
                        reservationId: id
                    }
                }
            );
            resolve(reservationById);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.findSallesBookedByDay = function (startDate) {
    return new Promise(async (resolve, reject) => {
        try {
            var jour = new Date(startDate);
            var debutJour = jour.setHours(0);
            var finJour = jour.setHours(23);
            const sallesBookedByDay = await db.models.Room.findAll({
                include: [{
                    model: db.models.Reservation,
                    where: {
                        startDate: {
                            [Op.between]: [debutJour, finJour]
                        },
                        state: 1,
                    },
                    required: false
                }]
            });
            resolve(sallesBookedByDay);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.findSallesBookedBetween = function (startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        try {
            const sallesBookedBetween = await db.models.Room.findAll({
                include: [{
                    model: db.models.Reservation,
                    where: {
                        startDate: {
                            [Op.between]: [startDate, endDate]
                        },
                        state: 1,
                    }
                }
                ]
            });
            resolve(sallesBookedBetween);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.findReservationsByUserId = function (req) {
    return new Promise(async (resolve, reject) => {
        try {
            const reservationsByUserId = await db.models.Reservation.findAll({
                attributes: [
                    'reservationId',
                    'startDate',
                    'endDate',
                    'object',
                    'recurrence_id'
                ],
                where: {
                    user_id: req.query.userId,
                    endDate: { [Op.gt]: new Date() }
                },
                include: [{
                    model: db.models.Room
                }],
                order: [
                    ['startDate', 'ASC']
                ]
            });
            resolve(reservationsByUserId);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.findParticipantsByReservationId = function (idReservation) {
    return new Promise(async (resolve, reject) => {
        const participants = await db.sequelize.query(
            'select user.userId, lastName, firstName, email, das \
            from user inner join user_reservation on user.userId = user_reservation.userId\
            where user_reservation.reservationId = (:idReservation)' , {
            replacements: { idReservation: idReservation },
            type: db.sequelize.QueryTypes.SELECT
        }
        )
        resolve(participants);
    })
}

module.exports.findSallesBookedById = function (req) {
    return new Promise(async (resolve, reject) => {
        try {
            const list = await db.sequelize.query(
                'select reservationId, reservation.startDate, reservation.endDate, object, recurrence_id,\
                user_id, lastName, firstName,\
                room_id, room.name, capacity, area\
                from user inner join (reservation) on user.userId = reservation.user_id \
                inner join (room) on (reservation.room_id) = (room.roomId)\
                WHERE reservation.room_id = (:idSalle)\
                and reservation.startDate >= (:startDate)\
                and reservation.endDate <= (:endDate)', {
                replacements: {
                    idSalle: req.query.roomId,
                    startDate: req.query.startDate, endDate: req.query.endDate
                },
                type: db.sequelize.QueryTypes.SELECT
            }
            )
            resolve(list);
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

module.exports.findReservationByRoomByDate = function (roomId, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db.models.Reservation.findOne({
                attributes: [
                    'reservationId',
                    'startDate',
                    'endDate'
                ],
                where: {
                    [Op.and]: {
                        room_id: roomId,
                        [Op.or]: {
                            startDate: {
                                [Op.gte]: startDate,
                                [Op.lte]: endDate
                            },
                            endDate: {
                                [Op.gte]: startDate,
                                [Op.lte]: endDate
                            }
                        }
                    }
                },
                include: [{
                    model: db.models.User,
                    attributes: [
                        'lastName',
                        'firstName',
                        'email'
                    ]
                }]
            })
            resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

module.exports.checkReservation = function (roomId, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.models.Reservation.findAll({
                attributes: [
                    'reservationId',
                    'startDate',
                    'endDate',
                    'room_id',
                ],
                where: {
                    
                        room_id: roomId,
                        [Op.or]: {
                            
                                endDate: {
                                    [Op.gt]: startDate,
                                    [Op.lte]: endDate
                                },
                            
                            
                                startDate: {
                                    [Op.gte]: startDate,
                                    [Op.lt]: endDate
                                },
                            
                            [Op.and]: {
                                startDate: {
                                    [Op.lte]: startDate
                                }, 
                                endDate: {
                                    [Op.gte]: endDate
                                }
                            }
                        }
                    
                },
                include: [{
                    model: db.models.User,
                    required: true,
                    attributes: [
                        'userId',
                        'firstName',
                        'lastName',
                        'email'
                    ]
                },
                {
                    model: db.models.Room,
                    required: true,
                    attributes: [
                        'name'
                    ]
                }]
            })

            //result = await db.models.Reservation.findAll();

            /* const result = await db.sequelize.query('\
                select reservationId, startDate, endDate, room_id, userId, firstName, lastName, email from reservation inner join user on reservation.user_id = user.userId\
                where room_id = (:roomId)\
                AND (\
                    (endDate > (:startDate) AND endDate <= (:endDate))\
                    OR\
                    (startDate >= (:startDate) AND startDate < (:endDate))\
                    OR\
                    (startDate <= (:startDate) AND endDate >= (:endDate))\
                )\
            ', {
                replacements: {
                    roomId: roomId,
                    startDate: startDate,
                    endDate: endDate
                },
                type: db.sequelize.QueryTypes.SELECT
            }) */
            resolve(result)
        } catch (error) {
            console.error(error)
        }
    })
}


// POST
module.exports.createReservation = function (dateDebut, dateFin, objet, etat, user_id, recurrence_id, salle_id) {
    return new Promise(async (resolve, reject) => {
        try {

            const nouvReservation = await db.models.Reservation.create(
                {
                    startDate: dateDebut,
                    endDate: dateFin,
                    object: objet,
                    state: etat,
                    user_id: user_id,
                    recurrence_id: recurrence_id,
                    room_id: salle_id

                });

            try {
/*                 if (req.body.users != null) {
                    const crea = new Date();
                    // Parcours des idUser de la req
                    req.body.users.forEach(element => {
                        const raw1 = db.sequelize.query(
                            'INSERT into user_reservation (createdAt, updatedAt, reservationId, userId)\
                            VALUES ((:crea), (:crea),(:reservation_id), (:user_id))', {
                            replacements: {
                                crea: crea,
                                reservation_id: nouvReservation.reservationId,
                                user_id: element
                            },
                            type: db.sequelize.QueryTypes.INSERT
                        }
                        );
                    });
                } */

            } catch (err) {
                console.log(err)
                resolve(err)
            }

            resolve(nouvReservation);

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

module.exports.insertMultipleReservation = function (listReservation) {
    return new Promise(async (resolve, reject) => {
        const createdReservation = await db.models.Reservation.bulkCreate(listReservation)
        .then(function(res){
            return resolve(res);
        })
        .catch(function(err){
            console.log(err);
            return resolve(err)
        })
    })
}


// PUT
module.exports.modifyReservation = function (req) {
    return new Promise(async (resolve, reject) => {
        try {
            const modifiedReservation = await db.models.Reservation.update(
                {
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    object: req.body.object,
                    reservationId: req.body.reservationId,
                    room_id: req.body.roomId
                },
                {
                    where: {
                        reservationId: req.body.reservationId
                    },
                    returning: true,
                }).then(function (modifiedReservation){
                    console.log(modifiedReservation)
                    return resolve(modifiedReservation);
                })
        } catch (error) {
            return reject(error)
        }
    });
};


// DELETE
module.exports.destroyReservation = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            db.models.Reservation.destroy({
                where: {
                    reservationId: id
                }
            }).then((result) => {
                resolve(result);
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}
