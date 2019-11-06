module.exports = (sequelize, Sequelize) => {
    const salle = sequelize.define('salle', {
        idSalle: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        nom: {
            type: Sequelize.STRING(45)
        },
        zone: {
            type: Sequelize.STRING(45)
        },
        capicite: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: "salle",
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    });

    return salle;
};