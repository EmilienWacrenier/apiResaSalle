module.exports = (sequelizeModels, Sequelize) => {
    const user = sequelizeModels.define(
        'user', {
        idUser: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        firstname: {
            allowNull: false,
            type: Sequelize.STRING(45)
        },
        lastname: {
            allowNull: false,
            type: Sequelize.STRING(45)
        },
        das: {
            type: Sequelize.STRING(45),
            allowNull: false,
            unique: true,
        },
        email: {
            allowNull: false,
            type: Sequelize.STRING(255),
        },
        mdp: {
            allowNull: false,
            type: Sequelize.STRING(255)
        },
        role_id: {
            allowNull: false,
            type: Sequelize.INTEGER(45)
        }
    }, {
        tableName: "user",
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    }
    );

    user.associate = function (models){
        user.belongsTo(models.role, {
            foreignKey: 'role_id'
        });
        user.belongsToMany(models.reservation, {
            through: 'user_reservation',
            as: 'reservations',
            foreignKey: 'idUser',
            otherKey: 'idReservation'
        })
        
    }

    return user;
};