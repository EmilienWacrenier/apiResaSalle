const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = 'Europe/Paris'; //UTC+01:00
const momentE = require('moment-easter');

const REGEX = require('../validation/regex');

const userBuilder = require('../../builders/user.builder');

//RESERVATION
//Params de reservation.service
module.exports.test_params_booking = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Récupération des paramètres de requête
            var startDate = req.body.startDate; // date de début
            var endDate = req.body.endDate; //date de fin
            var object = req.body.object; // objet de la réunion
            var roomId = req.body.roomId; //id de la salle réservée
            var userId = req.body.userId; // id du créateur de la réunion
            var users = req.body.users; // id des participants
            // Vérification de l'existence des params sur la réservation
            if (startDate == null || endDate == null || object == null
                || object == ""
                || roomId == null || userId == null || users == null) {
                return resolve({ code: 400, result: 'Un champs de réservation est nul' });
            }
            //Vérification de l'existence des participants
            var testUsers = await this.test_users(users);
            if (testUsers.result==false) {
                return resolve({ code:400, result:'User non trouve'});
            }
            return resolve({ code:200, result:'Tous les paramètres sont OK'});
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}
//Existence des participants (req.body.users)
module.exports.test_users = (users) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (users != null) {
                for (const idUser of users) {
                    req1 = {
                        query: {
                            userId: idUser
                        }
                    }
                    var existingUser = await userBuilder.findUserById(req1)
                    if (existingUser == null) {
                        return resolve({ code: 400, result: false});
                    }
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
};
//RECURRENCE
//Params de récurrence.service
module.exports.test_params_recurrence = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Récupération des paramètres de requête
            var label = req.body.labelRecurrence;
            var startDateRecurrence = req.body.startDateRecurrence;
            var endDate = req.body.endDateRecurrence;
            const libellesRecurrence = ['hebdomadaire', 'quotidien', 'mensuel', 'annuel'];
            // Vérification de l'existence des params sur la récurrence
            if (startDate == null || endDate == null || label == "" || label== null) {
                return resolve({ code: 400, result: 'Un champs de récurrence est null' });
            }
            if(!libellesRecurrence.includes(label)){
                return resolve({code:400, result:'Libelle non valide'});
            }
            return resolve({ code:200, result:'Tous les paramètres sont OK'});
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}
//Vérifier
