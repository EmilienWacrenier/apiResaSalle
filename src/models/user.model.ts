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
            type: Sequelize.STRING(45)
        },
        lastname: {
            type: Sequelize.STRING(45)
        },
        das: {
            type: Sequelize.STRING(45),
            allowNull: false,
            unique: true,
        },
        email: {
            type: Sequelize.STRING(255),
        },
        mdp: {
            type: Sequelize.STRING(255)
        },
        role_id: {
            type: Sequelize.INTEGER(45)
        }
    }, {
        tableName: "user",
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    }
    );

    return user;
};