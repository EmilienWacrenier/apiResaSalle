const db = require ('../config/db.config');

module.exports.findUsers = function(){
    return new Promise(async (resolve, reject) => {
        const user = await db.models.User.findAll();
        resolve(user);
    })
}

module.exports.findUser = function(){
    return new Promise(async (resolve, reject) => {
        const user = await db.models.User.findOne({
            where: {
                idUser: 1
            }
        });
        resolve(user);
    })
}