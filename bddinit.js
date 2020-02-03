module.exports = function (db) {
    initRole()
    initRoom()
    initUser()
    initReservation()
    initRecurrence()


    function initRole() {
        roleList = [
            { name: 'Utilisateur' },
            { name: 'Admin' }
        ]
        db.models.Role.bulkCreate(roleList)
    }

    function initRoom() {
        roomList = [
            { name: 'room1', area: 'A', capacity: 10 },
            { name: 'room2', area: 'B', capacity: 6 },
            { name: 'room3', area: 'C', capacity: 4 },
            { name: 'room4', area: 'A', capacity: 8 },
            { name: 'room5', area: 'D', capacity: 12 },
        ]
        db.models.Room.bulkCreate(roomList)
    }

    function initUser() {
        const bcrypt = require('bcryptjs')
        const salt = bcrypt.genSaltSync(5)
        const jeanMdp = bcrypt.hashSync('jean', salt);
        const pierreMdp = bcrypt.hashSync('pierre', salt);
        const resMdp = bcrypt.hashSync('res', salt);

        userList = [
            { firstName: 'Jean', lastName: 'Bon', das: 'A111111', email: 'jean.bon@gmail.com', pwd: jeanMdp, isActive: 1, role_id: 1 },
            { firstName: 'Pierre', lastName: 'Feuille', das: 'A222222', email: 'pierre.feuille@gmail.com', pwd: pierreMdp, isActive: 1, role_id: 1 },
            { firstName: 'Res', lastName: 'Ekla', das: 'A333333', email: 'res.ekla@gmail.com', pwd: resMdp, isActive: 1, role_id: 2 }
        ]
        db.models.User.bulkCreate(userList)
    }

    function initReservation() {
        reservationList = [
            {startDate: '2020-02-15 10:00:00', endDate: '2020-02-15 11:00:00', object: 'Démonstration application ResEkla', state: 1, user_id: 1, recurrence_id: null, room_id: 1},
            {startDate: '2020-03-14 14:00:00', endDate: '2020-03-14 15:30:00', object: 'Point sur l\'avancement de l\'application', state: 1, user_id: 2, recurrence_id: null, room_id: 3}
        ]
        db.models.Reservation.bulkCreate(reservationList)
    }

    function initRecurrence() {
        const recurrenceList = [
            {label: 'mensuelle', startDate: '2020-02-15 10:00:00', endDate: '2020-07-15 11:00:00'}
        ]
        db.models.Recurrence.bulkCreate(recurrenceList)

        const reservationRecurrenceList = [
            {startDate: '2020-02-15 10:00:00', endDate: '2020-02-15 11:00:00', object: 'Démonstration application ResEkla', state: 1, user_id: 1, recurrence_id: 1, room_id: 2},
            {startDate: '2020-03-15 10:00:00', endDate: '2020-03-15 11:00:00', object: 'Démonstration application ResEkla', state: 1, user_id: 1, recurrence_id: 1, room_id: 2},
            {startDate: '2020-04-15 10:00:00', endDate: '2020-04-15 11:00:00', object: 'Démonstration application ResEkla', state: 1, user_id: 1, recurrence_id: 1, room_id: 2},
            {startDate: '2020-05-15 10:00:00', endDate: '2020-05-15 11:00:00', object: 'Démonstration application ResEkla', state: 1, user_id: 1, recurrence_id: 1, room_id: 2},
            {startDate: '2020-06-15 10:00:00', endDate: '2020-06-15 11:00:00', object: 'Démonstration application ResEkla', state: 1, user_id: 1, recurrence_id: 1, room_id: 2},
            {startDate: '2020-07-15 10:00:00', endDate: '2020-07-15 11:00:00', object: 'Démonstration application ResEkla', state: 1, user_id: 1, recurrence_id: 1, room_id: 2},
        ]
        db.models.Reservation.bulkCreate(reservationRecurrenceList)
    }
}