const db = require('../config/db.config');
const Op = require('Sequelize').Op

module.exports.findUsers = function () {
    return new Promise(async (resolve, reject) => {
        const user = await db.models.User.findAll();
        resolve(user);
    })
}

module.exports.findUserByEmail = function (req) {
    return new Promise(async (resolve, reject) => {
        const user = await db.models.User.findOne({
            where: {
                email: req.body.email
            }
        });
        resolve(user);
    })
}

module.exports.findUserByEmailOrByDas = function (req) {
    return new Promise(async (resolve, reject) => {
        try{
            const user = await db.models.User.findOne({
                where: {
                    [Op.or]: [
                        { das: req.body.das },
                        { email: req.body.email }
                    ]
                }
            });
            resolve(user);
        }
        catch(err){
            resolve(err);
        }
    })
}

module.exports.createUser = function (req, bcryptedPassword) {
    return new Promise(async (resolve, reject) => {
        try{
            var createdUser = await db.models.User.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                das: req.body.das,
                email: req.body.email,
                mdp: bcryptedPassword,
                role_id: 2
            }).then(function(createdUser){
                resolve(createdUser);
            })
        }
        catch(err){
            resolve(err);
        }
    })
}

