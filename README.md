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

- Route : localhost:3000/reservation/createBooking
'''
router.post('/createBooking', ReservationController.createBooking);
'''
-- Utilisation de express.Router()
-- post : écriture dans la base (requiert des paramètres en body)
-- Appelle la fonction createBooking définie dans src/controllers/reservation.controller.js via la route /createBooking

- Controller : rôle de "manager", organise les tâches effectuées dans les services








## Documentation technique

### Inventaire des Services

#### Dans src/services

Services liés aux entité de la bdd

#### Dans src/tools

Services annexes utilisés pour tester différents paramètres

### Logique de développement

#### Best practices

#### Git

### Inventaire des entry points
