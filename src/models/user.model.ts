module.exports = (sequelizeModels, Sequelize) => {
    const user = sequelizeModels.define(
        'user', {
        userId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        firstName: {
            allowNull: false,
            type: Sequelize.STRING(45)
        },
        lastName: {
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
            unique: true
        },
        pwd: {
            allowNull: false,
            type: Sequelize.STRING(255)
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defautValue: false
        },
        role_id: {
            allowNull: false,
            type: Sequelize.INTEGER(45)
        }
    }, {
        tableName: "user",
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
            foreignKey: 'userId',
            otherKey: 'reservationId'
        })
    }

    return user;
};