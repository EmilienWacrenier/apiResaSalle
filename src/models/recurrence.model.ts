
module.exports = (sequelize, Sequelize) => {
    const recurrence = sequelize.define('recurrence', {
        recurrenceId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        label: {
            type: Sequelize.STRING(45)
        },
        startDate: {
            type: Sequelize.DATE,
            get() {
                return moment(this.getDataValue('startDate')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        endDate: {
            type: Sequelize.DATE,
            get() {
                return moment(this.getDataValue('endDate')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        tableName: "recurrence",
        timestamps: false,
        freezeTableName: true,
    });

    return recurrence;
};