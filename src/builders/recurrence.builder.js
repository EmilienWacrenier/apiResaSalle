const db = require('../config/db.config');
const Op = require('Sequelize').Op;

module.exports = {
    create_recurrence: function(req){
        return new Promise(async(resolve, reject) => {
            try {
                var createdRecurrence = await db.models.Recurrence.create({
                    libelle: req.body.labelRecurrence,
                    dateDebut: req.body.startDateRecurrence,
                    dateFin: req.body.endDateRecurrence
                }).then(function(createdRecurrence){
                    if(createdRecurrence){
                        resolve(createdRecurrence)
                    }
                });
            } catch (err) {
                resolve(err);
            }
        });
    },


}