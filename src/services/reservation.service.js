const reservationBuilder = require('../builders/reservation.builder');
const recurrenceBuilder = require('../builders/recurrence.builder');

const moment = require('moment');
const momentTz = require('moment-timezone');

//Créer une réservation
module.exports.create_reservation = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Vérification de la présence des infos sur la réservation
            if (req.body.dateDebut == null || req.body.dateFin == null || req.body.objet == null
                || req.body.salle_id == null || req.body.user_id == null) {
                resolve({ 'Erreur': 'Un champs de réservation est nul' });
            }

            // Vérification de la présence des infos sur la récurrence
            if (req.body.libelleRecurrence != null && req.body.dateDebutRecurrence != null
                && req.body.dateFinRecurrence != null) {

                // Vérification du libelleRecurrence
                if (req.body.libelleRecurrence == "quotidien" || req.body.libelleRecurrence == "hebdomadaire"
                    || req.body.libelleRecurrence == "mensuel" /*|| req.body.libelleRecurrence == "annuel"*/) {

                    // Création de la récurrence
                    var createdRecurrence = await recurrenceBuilder.create_recurrence(req)

                    // Vérification de la création de la récurrence
                    if (createdRecurrence.idRecurrence != null) {
                        var currentDateDebut = new Date(req.body.dateDebut);
                        currentDateDebut.setHours(currentDateDebut.getHours() + 1)
                        var currentDateFin = new Date(req.body.dateFin);
                        currentDateFin.setHours(currentDateFin.getHours() + 1)
                        var dateFinRecurrence = new Date(req.body.dateFinRecurrence);
                        var nbResa = 0;

                        // Création des réservations associées à la récurrence
                        while (currentDateFin < dateFinRecurrence) {
                            // Ignorer les week-ends
                            if (!(currentDateDebut.getDay() == 6 || currentDateDebut.getDay() == 0)) {
                                var currentCreatedReservation = await reservationBuilder.createReservation(
                                    currentDateDebut, currentDateFin, req.body.objet, 1, req.body.user_id,
                                    createdRecurrence.idRecurrence, req.body.salle_id
                                );
                                nbResa++;
                            }

                            // Test du type de récurrence + incrémentation de la date
                            switch (createdRecurrence.libelle) {
                                case "quotidien":
                                    currentDateDebut.setDate(currentDateDebut.getDate() + 1);
                                    currentDateFin.setDate(currentDateFin.getDate() + 1);
                                    break;

                                case "hebdomadaire":
                                    currentDateDebut.setDate(currentDateDebut.getDate() + 7);
                                    currentDateFin.setDate(currentDateFin.getDate() + 7);
                                    break;

                                case "mensuel":
                                    currentDateDebut.setMonth(currentDateDebut.getMonth() + 1);
                                    currentDateFin.setMonth(currentDateFin.getMonth() + 1);
                                    break;

                                /*case "annuel":
                                    currentDateDebut.setYea(currentDateDebut.getDate() + 7);
                                    currentDateFin.setDate(currentDateFin.getDate() + 7);
                                    break;*/

                                default:
                                    currentDateDebut.setDate(currentDateDebut.getDate() + 1);
                                    currentDateFin.setDate(currentDateFin.getDate() + 1);
                                    break;
                            }
                        }
                        resolve({ 'Msg': 'OK Recurrence', 'Nombre d\'entrée': nbResa });
                    }
                }
                else {
                    resolve({ 'Erreur': 'Libelle récurrence incorrect' });
                }
            }
            else {
                // Résa simple
                try {
                    const timezone = 'Europe/Paris';
                    const momentDateDebut = moment(req.body.dateDebut, 'YYYY-MM-DD HH:mm');
                    const momentDateFin = moment(req.body.dateFin, 'YYYY-MM-DD HH:mm');
                    //console.log(momentDateFin.toString());
                    //resolve(new Date (Date.UTC(req.body.dateDebut, 'YYYY-MM-DD HH:mm')))
                    //console.log(momentDate.toString());

                    var createdReservation = await reservationBuilder.createReservation(
                        req.body.dateDebut, req.body.dateFin, req.body.objet, 1, req.body.user_id,
                        null, req.body.salle_id
                    );
                    resolve(createdReservation);
                }
                catch (error) {
                    resolve({'error':error})
                }
            }
        } catch (err) {
            reject({
                status: 500,
                message: err
            });
        };
    })
};
//get all reservations
module.exports.get_reservations = () => {
    return new Promise(async (resolve, reject) => {
        const reservations = await reservationBuilder.findReservations();
        resolve(reservations);
    });
};
//get reservation by id
module.exports.get_reservation_by_id = (params) => {
    return new Promise(async (resolve, reject) => {
        const {
            id
        } = params;
        const reservation = await reservationBuilder.findReservationById(id);
        resolve(reservation);
    });
};
