const reservationBuilder = require('../builders/reservation.builder');
const recurrenceBuilder = require('../builders/recurrence.builder');
const mailService = require('../service/mail.service');

//Créer une réservation
module.exports.create_reservation = (body, req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                dateDebut,
                dateFin,
                objet,
                etat,
                user_id,
                // recurrence_id,
                salle_id
            } = body;

            // Vérification de la présence des infos sur la récurrence
            if (req.body.libelleRecurrence != null && req.body.dateDebutRecurrence != null
                && req.body.dateFinRecurrence != null) {

                // Vérification du libelleRecurrence
                if (req.body.libelleRecurrence == "quotidien" || req.body.libelleRecurrence == "hebdomadaire"
                    || req.body.libelleRecurrence == "mensuel" || req.body.libelleRecurrence == "annuel") {

                    // Création de la récurrence
                    var createdRecurrence = await recurrenceBuilder.create_recurrence(req)

                    // Vérification de la création de la récurrence
                    if (createdRecurrence.idRecurrence != null) {
                        var currentDateDebut = new Date(req.body.dateDebut);
                        currentDateDebut.setHours(currentDateDebut.getHours() + 1)
                        var currentDateFin = new Date(req.body.dateFin);
                        currentDateFin.setHours(currentDateFin.getHours() + 1)
                        var dateFinRecurrence = new Date(req.body.dateFinRecurrence);

                        // Création des réservations associées à la récurrence
                        while (currentDateFin < dateFinRecurrence) {
                            if (!(currentDateDebut.getDay() == 6 || currentDateDebut.getDay() == 0)) {
                                var currentCreatedReservation = await reservationBuilder.createReservation(
                                    currentDateDebut, currentDateFin, objet, etat, user_id,
                                    createdRecurrence.idRecurrence, salle_id
                                );
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
                        resolve({ 'Msg': 'OK Recurrence' });
                    }
                }
            }
            else {
                // Résa simple
                var CreatedReservation = await reservationBuilder.createReservation(
                    req.body.dateDebut, req.body.dateFin, objet, etat, user_id,
                    null, salle_id
                );
                resolve(CreatedReservation);
            }
            // Envoi d'un mail aux participants
            mailService.transporter.sendMail(mailService.message, function(error,info){
                if(error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.reponse);
            });
            mailService.transporter.close();
            // Avant
            //const nouvReservation = await reservationBuilder.createReservation(
            // dateDebut, dateFin, objet, etat, user_id, /*recurrence_id,*/ salle_id
            //);
            //resolve(nouvReservation);

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
