const userService = require('../services/user.service');
const jwt = require('../interceptors/jwt');
const db = require('../config/db.config');

exports.getUsers = async (req, res) => {
    let data = await userService.get_users();
    return res.status(200).json(data);
}

exports.getUser = async (req, res) => {
    let data = await userService.get_user(req);
    return res.status(200).json(data);
}

exports.inscription = async (req, res) => {
    try {
        // Vérification de l'existance du das
        db.models.User.findOne({
            attributes: ['email', 'das'],
            where: {
                email: req.body.email,
                das: req.body.das
            }
        })
            .then(function (userFound) {
                if (!userFound) {
                    // Si le das n'existe pas, création d'un utilisateur
                    var responseUser = db.models.User.create({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        das: req.body.das,
                        email: req.body.email,
                        mdp: req.body.mdp,
                        role_id: 1
                    })
                        .then(function (responseUser) {
                            return res.status(200).json(responseUser);
                        })
                }
                else {
                    // L'utilisateur existe déjà
                    return res.status(200).json({ 'Message': 'Deja la' });
                }
            })
    }
    catch (err) {
        return res.json(err);
    }
}

exports.connexion = async (req, res) => {
    // Récupération des paramètres
    var email = req.body.email;
    var mdp = req.body.mdp;
    // Les paramètre existent bien
    if (email == null || mdp == null) {
        return res.status(400).json({ 'Erreur': 'Email ou mdp vide' });
    }
    else {
        // Recherche de l'utilisateur dans la bdd
        db.models.User.findOne({
            where: { email: email }
        })
            .then(function (userFound) {
                if (userFound) {
                    // Si l'utilisateur existe bien dans la bdd
                    if(mdp == userFound.mdp){
                        // Si le mdp est correct
                        return res.status(200).json({
                            'idUser': userFound.idUser,
                            'token': jwt.generateTokenForUser(userFound)
                        })
                    }
                    else{
                        // Si le mdp n'est pas correct
                        return res.status(403).json({'Erreur':'Le mot de passe n\'est pas valide'})
                    }
                }
                else {
                    // Si l'utilisateur n'est pas trouvé
                    return res.status(400).json({ 'Erreur': 'Aucun utilisateur pour cet email' });
                }
            })
    }
}