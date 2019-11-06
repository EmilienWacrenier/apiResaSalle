module.exports = (sequelize, Sequelize) => {
    const reservation = sequelize.define('reservation', {
        idReservation: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        dateDebut: {
            type: Sequelize.DATE
        },
        dateFin: {
            type: Sequelize.DATE
        },
        objet: {
            type: Sequelize.STRING(45)
        },
        etat: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defautValue: true
        },
        User_id: {
            type: Sequelize.INTEGER(45)
        },
        Recurrence_id:  {
            type: Sequelize.INTEGER(45)
        },
        Salle_id: {
            type: Sequelize.INTEGER(45)
        }
    }, {
        tableName: "reservation",
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    });

    return reservation;
};