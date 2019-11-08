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
            allowNull: false,
            type: Sequelize.STRING(45)
        },
        zone: {
            allowNull: true,
            type: Sequelize.STRING(45)
        },
        capicite: {
            allowNull: false,
            type: Sequelize.INTEGER
        }
    }, {
        tableName: "salle",
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    });

    // salle.associate = function(models) {
    //   salle.hasMany(models.reservation);
    // };

    return salle;
};
