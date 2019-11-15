const userService = require('../services/user.service');
const recurrenceService = require('../services/recurrence.service');

const jwt = require('../interceptors/jwt');
const db = require('../config/db.config');
const Op = require('Sequelize').Op;
const bcrypt = require('bcrypt');

getCode = function(code){
    if(code == null){
        return 200;
    }
    else{
        return code;
    }
}



exports.getUsers = async (req, res) => {
        let data = await userService.get_users();
        return res.status(200).json(data);
}

exports.getUser  = async (req, res) => {
    let data = await recurrenceService.createRecurrence(req);
    return res.status(200).json(data);
}
 
exports.inscription = async (req, res) => {
    let data = await userService.inscription(req);
    return res.status(data.code).json({result:data.result});
}

exports.connexion = async (req, res) => {
    let data = await userService.connexion(req);
    return res.status(data.code).json({result:data.result});
}
