module.exports = (sequelize, Sequelize) => {
    const recurrence = sequelize.define('recurrence', {
        idRecurrence: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        libelle: {
            type: Sequelize.STRING(45)
        },
        dateDebut: {
            type: Sequelize.DATE
        },
        dateFin: {
            type: Sequelize.DATE
        }
    }, {
        tableName: "recurrence",
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    });

    return recurrence;
};