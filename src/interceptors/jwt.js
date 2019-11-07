var jwt = require('jsonwebtoken');
const JWT_SIGNATURE = '4TSL6RNxRxVOdhGQQOGUoFbSv2yIfYjNvNDEJyiVFqGd7p7dH4pC3tIeVR0yNISBwYAfJiSGJbe4HlWO';

module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            idUser: userData.idUser,
            role: userData.role_id,
            firstname: userData.firstname,
            lastname: userData.lastname
        },
        JWT_SIGNATURE,
        {
            expiresIn: '20m'
        })
    }
}