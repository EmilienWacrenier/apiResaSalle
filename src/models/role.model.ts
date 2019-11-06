module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define('role', {
        idRole: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        roleName: {
            type: Sequelize.STRING
        }
    }, {
        tableName: "role",
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    });

    

    return role;
};