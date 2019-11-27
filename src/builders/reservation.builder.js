const db = require('../config/db.config');
const Op = require('Sequelize').Op;


//Créer une réservation
module.exports.createReservation = function (dateDebut, dateFin, objet, etat, user_id, recurrence_id, salle_id, req) {
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
                if (req.body.users != null) {
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
                }

            } catch (err) {
                console.log(err)
                reject(err)
            }

            resolve(nouvReservation);

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//Trouver toutes les reservations
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
//Trouver 1 reservation par id
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

//Trouver les salles réservées par jour (body: date)
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
                    }
                }]
            });
            resolve(sallesBookedByDay);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//Trouver les salles associées à une résa entre startDate et endDate
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
                where: {
                    user_id: req.query.userId
                }
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
            'select * from user inner join user_reservation on user.userId = user_reservation.userId\
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
                'select * from (reservation) inner join (room) on (reservation.room_id) = (room.roomId)\
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
