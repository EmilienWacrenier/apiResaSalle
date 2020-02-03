const userBuilder = require('../builders/user.builder');
const bcrypt = require('bcryptjs');
const jwt = require('../interceptors/jwt');
const general = require('./general.service');

const REGEX = require('../tools/validation/regex');


// GET
module.exports.get_users = () => {
    return new Promise(async (resolve, reject) => {
        const user = await userBuilder.findUsers();
        return resolve({
            code: 200,
            result: user
        });
    })
}

module.exports.get_user = (req) => {
    return new Promise(async (resolve, reject) => {
        const user = await userBuilder.findUser(req); //findUser à coder ?
        resolve(user);
    })
}

module.exports.get_user_by_id = (req) => {
    return new Promise(async (resolve, reject) => {
        if (req.query.userId == null) {
            return resolve({
                code: 400,
                result: "userId manquant dans la requête"
            })
        }
        const user = await userBuilder.findUserById(req);
        return resolve({
            code: 200,
            result: user
        });
    })
}

module.exports.connexion = (req) => {
    return new Promise(async (resolve, reject) => {
        const che = general.checkParam(req, ["email", "pwd"]) != null ? console.log("manque un param") : console.log("tout les param")

        const checkedParams = general.checkParam(req, ["email", "pwd"]);
        if (checkedParams != null) {
            return resolve(checkedParams);
        } else {
            // Récupération du user
            let user = await userBuilder.findUserByEmail(req);
            if (user == null) {
                // Si le user n'existe pas
                return resolve({
                    code: 404,
                    result: 'utilisateur non existant'
                });
            } else {
                // Comparaison du mot de passe
                bcrypt.compare(req.query.pwd, user.pwd, function (err, res) {
                    if (res) {
                        toResolve = {
                            'userId': user.userId,
                            'lastName': user.lastName,
                            'firstName': user.firstName,
                            'token': jwt.generateTokenForUser(user.idUser, user.role_id)
                        }
                        return resolve({
                            code: 200,
                            result: toResolve
                        });
                    } else {
                        return resolve({
                            code: 400,
                            result: 'mot de passe incorrect'
                        });
                    }
                });
            }
        }
    });
}


// POST
module.exports.inscription = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Vérification des paramètres
            const checkParam = verifParamRegister(req);
            if (checkParam != null) {
                return resolve(checkParam);
            }

            // L'utilisateur existe t'il déjà?
            const existingUser = await userBuilder.findUserByEmailOrByDas(req);
            if (existingUser != null) {
                return resolve({
                    code: 400,
                    result: 'Utilisateur déjà présent dans la bdd'
                });
            } else {
                // Création de l'utilisateur avec hashage de mdp
                bcrypt.hash(req.body.pwd, 5, function (err, bcryptedPassword) {
                    const createdUser = userBuilder.createUser(req, bcryptedPassword)
                        .then(function (createdUser) {
                            var newToken = jwt.generateTokenForUser(createdUser.userId)
                            return resolve({
                                code: 200,
                                result: createdUser,
                                token: newToken
                            });
                        });
                })
            }
        } catch (err) {
            console.log(err)
            return resolve({
                code: 400,
                result: err
            });
        }
    });
}


// PUT


// DELETE


// CHECK PARAM
function verifParamRegister(req) {
    if (req.body.lastName == null || req.body.firstName == null || req.body.das == null ||
        req.body.email == null || req.body.pwd == null) {
        return ({
            code: 400,
            result: 'Champs null'
        });
    }
    if (req.body.das.length != 7) {
        return ({
            code: 400,
            result: 'Das non valide'
        });
    }
    if (req.body.lastName.length > 45 || req.body.firstName.length > 45 || req.body.pwd.length < 8) {
        return ({
            code: 400,
            result: 'Longueur des champs'
        });
    }
    if (!REGEX.email.test(req.body.email)) {
        return ({
            code: 400,
            result: 'Email non valide'
        });
    }
    return null;
}


// ANNEXE
module.exports.check_user_id = async (userId) => {
    const userFound = await userBuilder.checkUserId(userId);
    if(userFound === null){
        return false;
    }
    return true;
}
