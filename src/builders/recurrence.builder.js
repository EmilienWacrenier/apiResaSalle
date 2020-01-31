const db = require('../config/db.config');
const Op = require('Sequelize').Op;

module.exports = {


    // POST
    create_recurrence: function(label, startDate, endDate){
        return new Promise(async(resolve, reject) => {
            try {
                var createdRecurrence = await db.models.Recurrence.create({
                    label: label,
                    startDate: startDate,
                    endDate: endDate
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