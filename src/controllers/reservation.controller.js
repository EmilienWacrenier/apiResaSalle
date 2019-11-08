const reservationService = require('../services/reservation.service');

const db = require('../config/db.config');
const Op = require('Sequelize').Op;

//get all reservations
exports.getReservations = async (req, res) => {
        /*let data = await reservationService.get_reservations();
        return res.status(200).json(data);*/
        
        db.models.Salle.findAll().then(function(salles){
                var sallesJsonParsed = JSON.parse(salles);
                sallesJsonParsed.forEach(element => {
                        element.reservations = JSON.parse(db.models.Reservation.findAll({
                                where: {salle_id: element.idSalle}
                        }))

                });
                return res.status(200).json(salles);
        })
        
};
//get 1 reservation by id
exports.getReservation = async (req, res) => {
        let data = await reservationService.get_reservation(req.params);
        return res.status(200).json(data);
};
