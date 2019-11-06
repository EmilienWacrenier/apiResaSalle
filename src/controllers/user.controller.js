const userService = require('../services/user.service');

exports.getUsers = async (req, res) => {
    let data = await userService.get_users();
    return res.status(200).json(data);
}

exports.getUser = async(req, res) => {
    let data = await userService.get_user();
    return res.status(200).json(data);
}