# apiResaSalle

## Fonctionnement général

Front ---(requêtes HTTP)---> Routes ----> Controllers ----> Services ----> [Builders ----> Models] --(requêtes sequelize)--> DataBase

- Routes : définit le chemin à utiliser pour appeler les différents Controllers
- Controllers : (Rôle de manager) récupère, organise et traite les résultats fournies par les services
- Services : (Rôle de collaborateur) travaille les données fournies par les builders (idéalement : 1 service = 1 action)
- Builders : Récupère ou écrit en base de données à l'aide des models (sequelize)

- Config : contient les fichiers de configuration (bdd, mail, etc)
- Interceptors : gestion des tokens
- Tools : regroupe différents services utiles ponctuellement (ex : test jour ouvré/férié)

## Exemple fonctionnel : création d'une réservation

Création d'une réservation
