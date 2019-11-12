const db = require('../config/db.config');
const Op = require('Sequelize').Op;

module.exports = {
    create_recurrence: function(req){
        return new Promise(async(resolve, reject) => {
            try {
                var createdRecurrence = await db.models.Recurrence.create({
                    libelle: req.body.libelleRecurrence,
                    dateDebut: req.body.dateDebutRecurrence,
                    dateFin: req.body.dateFinRecurrence
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