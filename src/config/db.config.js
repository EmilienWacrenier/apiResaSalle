const sequelize = require('../models').sequelize;
const Recurrence = require('../models').recurrence;
const Reservation = require('../models').reservation;
const Salle = require('../models').salle;
const Role = require('../models').role;
const User = require('../models').user;

const models = {
  Recurrence,
  Reservation,
  Salle,
  Role,
  User
};

const db = {
  models,
  sequelize
};

module.exports = db;