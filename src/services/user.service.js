const userBuilder = require('../builders/user.builder');
const bcrypt = require('bcrypt');
const jwt = require('../interceptors/jwt');

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

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
module.exports.inscription = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Vérification des paramètres
            if (req.body.lastname == null || req.body.firstname == null || req.body.das == null ||
                req.body.email == null || req.body.mdp == null) {
                return resolve({ code: 400, result: 'Champs null' });
            }
            if (req.body.das.length != 7) {
                return resolve({ code: 400, result: 'Das non valide' });

            }
            if (req.body.lastname.length > 45 || req.body.firstname.length > 45 || req.body.mdp.length < 8) {
                return resolve({ code: 400, result: 'Longueur des champs' });
            }
            if (!EMAIL_REGEX.test(req.body.email)) {
                return resolve({ code: 400, result: 'Email non valide' });
            }
            // L'utilisateur existe t'il déjà?
            const existingUser = await userBuilder.findUserByEmailOrByDas(req);
            if (existingUser != null) {
                return resolve({ code: 400, result: 'Utilisateur déjà présent dans la bdd' });
            }
            else {
                // Création de l'utilisateur avec hashage de mdp
                bcrypt.hash(req.body.mdp, 5, function (err, bcryptedPassword) {
                    const createdUser = userBuilder.createUser(req, bcryptedPassword)
                        .then(function (createdUser) {
                            return resolve({ code: 200, result: createdUser });
                        });
                })
            }
        }
        catch (err) {
            console.log(err)
            return resolve({ code: 400, result: err });
        }
    });
}

module.exports.connexion = (req) => {
    return new Promise(async (resolve, reject) => {
        // Récupération des paramètres
        let email = req.body.email;

        let mdp = req.body.mdp;
        // Vérification des paramètres
        if (email == null || mdp == null) {
            return resolve({ code: 400, result: 'Email ou mdp non renseigné' });
        }
        else {
            // Récupération du user
            let user = await userBuilder.findUserByEmail(req);
            if (user == null) {
                // Si le user n'existe pas
                return resolve({ code: 404, result: 'utilisateur non existant' });
            }
            else {
                // Comparaison du mot de passe
                bcrypt.compare(mdp, user.mdp, function (err, res) {
                    if (res) {
                        toResolve = {
                            'idUser': user.idUser,
                            'lastname': user.lastname,
                            'firstname': user.firstname,
                            'token': jwt.generateTokenForUser(user.idUser, user.role_id)
                        }
                        return resolve({ code: 200, result: toResolve });
                    }
                    else {
                        return resolve({ code: 400, result: 'mot de passe incorrect' });
                    }
                });
            }
        }
    });
}

