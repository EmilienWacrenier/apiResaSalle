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
        user_id: {
            type: Sequelize.INTEGER(45)
        },
        recurrence_id:  {
            
            type: Sequelize.INTEGER(45)
        },
        salle_id: {
            type: Sequelize.INTEGER(45)
        }
    }, {
        tableName: "reservation",
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    });

    reservation.associate = function(models){
        reservation.belongsTo(models.recurrence, {
            foreignKey: 'recurrence_id'
        });
        reservation.belongsTo(models.salle, {
            foreignKey: 'salle_id'
        });
        reservation.belongsTo(models.user, {
            foreignKey: 'user_id'
        });
        reservation.belongsToMany(models.user, {
            through: 'user_reservation'
        })
    }

    return reservation;
};