const db = require('../config/db.config');
const Op = require('Sequelize').Op;

//Créer une réservation
module.exports.createReservation = function (dateDebut, dateFin, objet, etat, user_id, recurrence_id, salle_id) {
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
                }
            );
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
        const reservationById = await db.models.Reservation.findOne(
            {
                where: {
                    id: id
                }
            }
        );
        resolve(reservationById);
    });
};

//Trouver les salles réservées par jour (body: date)
module.exports.findSallesBookedByDay = function (req) {
    return new Promise(async (resolve, reject) => {
        try {
            var jour = new Date(req.body.startDate);
            var debutJour = jour.setHours(0);
            var finJour = jour.setHours(23);
            const sallesBookedByDay = await db.models.Salle.findAll({
                include: [{
                    model: db.models.Reservation,
                    where: {
                        dateDebut: {
                            [Op.between] : [debutJour,finJour]
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
module.exports.findSallesBookedBetween = function (req) {
    return new Promise(async (resolve, reject) => {
        try {
            const sallesBookedBetween = await db.models.Salle.findAll({
                include: [{
                    model: db.models.Reservation,
                    where: {
                        dateDebut: {
                            [Op.between] : [req.body.startDate,req.body.endDate]
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
//Trouver une salle et afficher les réservations associées between startDate et endDate
module.exports.findSallesBookedById = function (req) {
    return new Promise(async (resolve, reject) => {
        try {
            const sallesBookedById = await db.models.Salle.findOne({
                    where: {
                        id_salle:req.body.id
                    },
                    include: [{
                        model: db.models.Reservation,
                        where: {
                            dateDebut: {
                                [Op.between] : [req.body.startDate,req.body.endDate]
                            },
                            etat: 1,
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
                        user_id:req.body.user_id
                    }
            });
        resolve(reservationsByUserId);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
