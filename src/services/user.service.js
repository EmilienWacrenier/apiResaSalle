const userBuilder = require('../builders/user.builder');

module.exports.get_users = () => {
    return new Promise(async (resolve, reject) => {
        const user = await userBuilder.findUsers();
        resolve(user);
    })
}

module.exports.get_user = (req) => {
    return new Promise(async (resolve, reject) => {
        const user = await userBuilder.findUser(req);
        resolve(user);
    })
}

/*module.exports.user_inscription = (req) => {
    return new Promise(async (resolve, reject) => {
        try{
            const newUser = userBuilder.inscriptionUser(req);
            resolve(newUser);
        } catch(err){
            reject({
                status: 500,
                message: err
            })
        }
    })
}*/