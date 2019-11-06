const userBuilder = require('../builders/user.builder');

module.exports.get_users = () => {
    return new Promise(async (resolve, reject) => {
        const user = await userBuilder.findUsers();
        resolve(user);
    })
}

module.exports.get_user = () => {
    return new Promise(async (resolve, reject) => {
        const user = await userBuilder.findUser();
        resolve(user);
    })
}