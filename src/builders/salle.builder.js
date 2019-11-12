const db = require('../config/db.config');
const Op = require('Sequelize').Op;

//Trouver toutes les Salles
module.exports.findSalles = function () {
    return new Promise(async (resolve, reject) => {
        try {
            const salles = await db.models.Salle.findAll();
            resolve(salles);
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
            const sallesBookedToday = await db.models.Salle.findAll({
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
        resolve(sallesBookedToday);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
//Trouver 1 Salle par id
module.exports.findSalle = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            const salle = await db.models.Salle.findOne(
                {
                    where: {
                        id: id
                    }
                }
            );
            resolve(salle);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
