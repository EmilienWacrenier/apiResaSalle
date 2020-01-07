# apiResaSalle

API REST node.js, express et sequelize

## Fonctionnement général

### Arborescence

Front ---(requêtes HTTP)---> Routes ----> Controllers ----> Services ----> [Builders ----> Models] --(requêtes sequelize)--> DataBase

### Rôles des différentes couches

- Routes : définit le chemin à utiliser pour appeler les différents Controllers
- Controllers : (Rôle de manager) récupère, organise et traite les résultats fournies par les services
- Services : (Rôle de collaborateur) travaille les données fournies par les builders (idéalement : 1 service = 1 action)
- Builders : Récupère ou écrit en base de données à l'aide des models (sequelize)

- Config : contient les fichiers de configuration (bdd, mail, etc)
- Interceptors : gestion des tokens
- Tools : regroupe différents services utiles ponctuellement (ex : test jour ouvré/férié)

### Exemple fonctionnel : création d'une réservation (createBooking)

**1. Route :** localhost:3000/reservation/createBooking

```
router.post('/createBooking', ReservationController.createBooking);
```

* Utilisation de express.Router()
* post : écriture dans la base (requiert des paramètres en body)
* Appelle la fonction createBooking définie dans src/controllers/reservation.controller.js via la route /createBooking

**2. Controller :**

```
const reservationService = require('../services/reservation.service');
const testParamService = require('../tools/services/test_params.service');
const recurrenceService = require('../services/recurrence.service');

exports.createBooking = async (req, res) => {
    //Vérifier la validité des paramètres
    let testParam = await testParamService.test_params_booking(req);
    console.log('testParam code (controller) :' + testParam.code);
    if (testParam.code == 400) {
        return res.status(testParam.code).json({ result: testParam.result });
    }
    let testParamRecurrence = await testParamService.test_params_recurrence(req);
    //Créer la réservation avec récurrence
    if (testParamRecurrence.code == 200) {
        //Vérif des conflits (date, salle, ...) pour les dates récurrentes
            //TODO avec working days service
        //créer de la réservation avec récurrence
        let data = await recurrenceService.create_recurrence(req);
        return res.status(data.code).json({ result: data.result });
    } else if (testParamRecurrence.code == 400) {
        // création d'une résa sans récurrence
        let data1 = await reservationService.create_booking(req);
        return res.status(data1.code).json({ result: data1.result });
    }
};
```
* Rôle de "manager", organise les tâches effectuées dans les services
* Appel des services utilisés avec require()

**3. Services :**

* Dans services/reservation.service.js :

```
module.exports.create_booking = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Récupération des paramètres de requête
            var startDate = req.body.startDate; // date de début
            var endDate = req.body.endDate; //date de fin
            var object = req.body.object; // objet de la réunion
            var roomId = req.body.roomId; //id de la salle réservée
            var userId = req.body.userId; // id du créateur de la réunion
            var users = req.body.users; // id des participants
            const dateDebut = momentTz.tz(startDate, 'YYYY-MM-DD HH:mm:ss');
            const dateFin = momentTz.tz(endDate, 'YYYY-MM-DD HH:mm:ss');
            // Présence de réservation entrant en conflit
            const existingResa = await reservationBuilder.findReservationByRoomByDate(
                roomId, dateDebut, dateFin
            )
            if(existingResa != null){
                console.log("bonjour")
                return resolve({ code: 400, result: 'Reservation déjà présente' });
            }
            var createdReservation = await reservationBuilder.createReservation(
                dateDebut, dateFin, object, 1, userId,
                null, roomId, req
            )
                .then(function (createdReservation) {
                    return resolve({ code: 200, result: createdReservation });
                })
            } catch (error) {
                    return resolve({ code: 400, result: error })
            }
    });
}
```

* Dans tools/services/test_params.service.js :

```
//Params de reservation.service
module.exports.test_params_booking = (req) => {
    return new Promise (async (resolve, reject) => {
        try {
            //Récupération des paramètres de requête
            var startDate = req.body.startDate; // date de début
            var endDate = req.body.endDate; //date de fin
            var object = req.body.object; // objet de la réunion
            var roomId = req.body.roomId; //id de la salle réservée
            var userId = req.body.userId; // id du créateur de la réunion
            var users = req.body.users; // id des participants
            //Vérification de l'existence des participants
            var testUsers = await this.test_users(users);
            // Vérification de l'existence des params sur la réservation
            if (startDate == null || endDate == null || object == null || object == "" || roomId == null || userId == null || users == null) {
                return resolve({ code: 400, result: 'Un champs de réservation est nul' });
            } else if (testUsers.code==400) {
                return resolve({ code:400, result:'Au moins 1 User non trouve'});
            } else if (testUsers.code==200) {
                return resolve({ code:200, result:'Tous les paramètres sont OK'});
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}
//Existence des participants (req.body.users)
module.exports.test_users = (users) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (users != null) {
                var existingUsers = [];
                for (const idUser of users) {
                    req1 = {
                        query: {
                            userId: idUser
                        }
                    }
                    var existingUser = await userBuilder.findUserById(req1);
                    if (existingUser!=null) {
                        existingUsers.push(existingUser.userId);
                    }
                }
                if (existingUsers.length==users.length) {
                    return resolve({ code: 200, result: 'Tous les participants existent en BDD'});
                } else {
                    return resolve({ code: 400, result: 'Il manque au moins 1 participant'});
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
};
//RECURRENCE
//Params de récurrence.service
module.exports.test_params_recurrence = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Récupération des paramètres de requête
            var label = req.body.labelRecurrence;
            var startDateRecurrence = req.body.startDateRecurrence;
            var endDateRecurrence = req.body.endDateRecurrence;
            const libellesRecurrence = ['hebdomadaire', 'quotidien', 'mensuel', 'annuel'];
            // Vérification de l'existence des params sur la récurrence
            if (startDateRecurrence == null || endDateRecurrence == null || label == "" || label== null) {
                return resolve({ code: 400, result: 'Un champs de récurrence est null' });
            }
            if(!libellesRecurrence.includes(label)){
                return resolve({code:400, result:'Libelle non valide'});
            }
            return resolve({ code:200, result:'Tous les paramètres sont OK'});
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}
```

* Rôle de "l'employé", effectue les taches avec les paramètres de requêtes
* Utilise les fonctions des builders, pour chercher ou inscrire des données en base, ou d'autres fonctions du même service

**4. Builders :**

```
module.exports.createReservation = function (dateDebut, dateFin, objet, etat, user_id, recurrence_id, salle_id, req) {
    return new Promise(async (resolve, reject) => {
        try {

            const nouvReservation = await db.models.Reservation.create(
                {
                    startDate: dateDebut,
                    endDate: dateFin,
                    object: objet,
                    state: etat,
                    user_id: user_id,
                    recurrence_id: recurrence_id,
                    room_id: salle_id

                });

            try {
                if (req.body.users != null) {
                    const crea = new Date();
                    // Parcours des idUser de la req
                    req.body.users.forEach(element => {
                        const raw1 = db.sequelize.query(
                            'INSERT into user_reservation (createdAt, updatedAt, reservationId, userId)\
                            VALUES ((:crea), (:crea),(:reservation_id), (:user_id))', {
                            replacements: {
                                crea: crea,
                                reservation_id: nouvReservation.reservationId,
                                user_id: element
                            },
                            type: db.sequelize.QueryTypes.INSERT
                        }
                        );
                    });
                }

            } catch (err) {
                console.log(err)
                resolve(err)
            }

            resolve(nouvReservation);

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
```

## Documentation technique

### Inventaire des Services

#### Dans src/services

Services liés aux entitées de la base de données

| Fichier                | Explication du service            |
| :--------------------: | :-------------------------------: |
| recurrence.service.js  | Vérification de la récurrence (Savoir si les réservations associées à la récurrence ont bien été créé, avec le bon type de récurrence et la bonne incrémentation de date )  |
| reservation.service.js | Création de une ou plusieurs réservations en vérifiant les informations (Utilisateurs, dates, objets, salle,...) en récurrence ou non |
| salle.service.js       | Obtenir une ou plusieurs salles, disponibles ou non ; Création/Modification/Suppression d'une salle avec vérification à chaque fois |
| user.service.js        | Obtenir un ou plusieurs utilisateurs par son ID ou non ; Inscription (vérification de chaque paramètres, si l'utilisateur existe déjà et création du hashage du mot de passe) ; Connection (Vérification de l'utilisateur et du mot de passe) |

#### Dans src/tools

Services annexes utilisés pour tester différents paramètres

### Logique de développement

#### Best practices

#### Git

### Inventaire des entry points
