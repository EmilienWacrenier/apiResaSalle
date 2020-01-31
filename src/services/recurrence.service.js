const recurrenceBuilder = require('../builders/recurrence.builder');
const generalService = require('../services/general.service');


// POST
module.exports.insertRecurrence = async function(label, startDate, endDate){
    const recurrence = await recurrenceBuilder.create_recurrence(label, startDate, endDate);
    return recurrence.dataValues.recurrenceId;
}