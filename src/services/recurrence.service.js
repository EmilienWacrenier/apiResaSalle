const recurrenceBuilder = require('../builders/recurrence.builder');
const generalService = require('../services/general.service');

module.exports.createRecurrence = async (req,res) => {
        return new Promise(async (resolve, reject) => {
            try {
                var createdRecurrence = recurrenceBuilder.create_recurrence(req);
                // Vérification de la création de la récurrence
                if (createdRecurrence.recurrenceId != null) {
                    var currentstartDate = new Date(req.body.startDate);
                    currentstartDate.setHours(currentstartDate.getHours() + 1)
                    var currentendDate = new Date(req.body.endDate);
                    currentendDate.setHours(currentendDate.getHours() + 1)
                    var endDateRecurrence = new Date(req.body.endDateRecurrence);

                    var listExistingResa = [];

                    // Création des réservations associées à la récurrence
                    while (currentendDate < endDateRecurrence) {
                        // Ignorer les week-ends
                        if (!(currentstartDate.getDay() == 6 || currentstartDate.getDay() == 0)) {
                            // Vérification de l'existance d'une reservation pour l'itération
                            const currentExistingResa = await reservationBuilder.findReservationByRoomByDate(
                                req.body.roomId, currentstartDate, currentendDate
                            )
                            if(currentExistingResa != null){
                                listExistingResa.push(currentExistingResa);
                            }
                            else{
                                var currentCreatedReservation = await reservationBuilder.createReservation(
                                    currentstartDate, currentendDate, req.body.object, 1, req.body.userId,
                                    createdRecurrence.recurrenceId, req.body.roomId, req
                                );
                            }
                        }
                        // Test du type de récurrence + incrémentation de la date
                        switch (createdRecurrence.libelle) {
                            case "quotidien":
                                currentstartDate.setDate(currentstartDate.getDate() + 1);
                                currentendDate.setDate(currentendDate.getDate() + 1);
                                break;

                            case "hebdomadaire":
                                currentstartDate.setDate(currentstartDate.getDate() + 7);
                                currentendDate.setDate(currentendDate.getDate() + 7);
                                break;

                            case "mensuel":
                                currentstartDate.setMonth(currentstartDate.getMonth() + 1);
                                currentendDate.setMonth(currentendDate.getMonth() + 1);
                                break;

                            default:
                                currentstartDate.setDate(currentstartDate.getDate() + 1);
                                currentendDate.setDate(currentendDate.getDate() + 1);
                                break;
                        }
                    }
                    return resolve({ code: 200, result: listExistingResa });
                }
            } catch (err) {
                console.log(err);
            }
        });
};

module.exports.insertRecurrence = async function(label, startDate, endDate){
    const recurrence = await recurrenceBuilder.create_recurrence(label, startDate, endDate);
    return recurrence.dataValues.recurrenceId;
}