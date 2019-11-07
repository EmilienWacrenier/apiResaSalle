const db = require('../config/db.config');

module.exports.findUsers = function () {
    return new Promise(async (resolve, reject) => {
        const user = await db.models.User.findAll();
        resolve(user);
    })
}

module.exports.findUser = function (req) {
    return new Promise(async (resolve, reject) => {
        const user = await db.models.User.findOne({
            where: {
                das: req.body.das
            }
        });
        resolve(user);
    })
}

/*module.exports.inscriptionUser = function (req) {
    return new Promise(async (resolve, reject) => {
        try {
            if(db.models.User.findOne({where: {das: req.body.das}})){
                reject('Utilisateur deja trouve');
            }
            else{
                const create = await db.models.User.create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    das: req.body.das,
                    email: req.body.email,
                    mdp: req.body.mdp,
                    role_id: 1
                })
                resolve(create)
            }

        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}*/