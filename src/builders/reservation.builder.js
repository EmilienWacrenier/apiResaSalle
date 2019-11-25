const db = require('../config/db.config');
const Op = require('Sequelize').Op;


//Créer une réservation
module.exports.createReservation = function (dateDebut, dateFin, objet, etat, user_id, recurrence_id, salle_id, req) {
    return new Promise(async (resolve, reject) => {
        try {

            const nouvReservation = await db.models.Reservation.create(
                {
                    dateDebut: dateDebut,
                    dateFin: dateFin,
                    objet: objet,
                    etat: etat,
                    user_id: user_id,
                    recurrence_id: recurrence_id,
                    salle_id: salle_id

                });
            console.log(nouvReservation.dateDebut + nouvReservation.dateFin);

            try {
                const crea = new Date();
                // Parcours des idUser de la req
                req.body.users.forEach(element => {
                    const raw1 = db.sequelize.query(
                        'INSERT into user_reservation (created_at, updated_at, id_reservation, id_user)\
                        VALUES ((:crea), (:crea),(:reservation_id), (:user_id))', {
                        replacements: {
                            crea: crea,
                            reservation_id: nouvReservation.idReservation,
                            user_id: element
                        },
                        type: db.sequelize.QueryTypes.INSERT
                    }
                    );
                });

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
                        idReservation: id
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
            const sallesBookedByDay = await db.models.Salle.findAll({
                include: [{
                    model: db.models.Reservation,
                    where: {
                        dateDebut: {
                            [Op.between]: [debutJour, finJour]
                        },
                        etat: 1,
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
            const sallesBookedBetween = await db.models.Salle.findAll({
                include: [{
                    model: db.models.Reservation,
                    where: {
                        dateDebut: {
                            [Op.between]: [startDate, endDate]
                        },
                        etat: 1,
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
//Trouver une salle et afficher les réservations associées entre startDate et endDate
module.exports.findSallesBookedById = function (salleId, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        try {
            const sallesBookedById = await db.models.Salle.findOne({
                where: {
                    id_salle: salleId
                },
                include: [{
                    model: db.models.Reservation,
                    where: {
                        salle_id: salleId,
                        dateDebut: {
                            [Op.between]: [startDate, endDate]
                        },
                        etat: 1
                    }
                }]
            });
            resolve(sallesBookedById);
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
                    user_id: req.body.user_id
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
            'select * from user inner join user_reservation on user.id_user = user_reservation.id_user\
            where user_reservation.id_reservation = (:idReservation)' , {
            replacements: { idReservation: idReservation },
            type: db.sequelize.QueryTypes.SELECT
        }
        )
        resolve(participants);
    })
}
