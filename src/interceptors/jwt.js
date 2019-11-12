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
    },

    testToken: function(req){
        var headerAuth = req.headers['authorization'];
        var idUser = module.exports.getUserId(headerAuth);
        if(idUser < 0){
            return false;
        }
        return true;
    },

    parseAuthorization: function(authorization){
        if(authorization != null){
            return authorization.replace('Bearer ', '');
        }
        else{
            console.log('null')
            return null
        }
    },

    getUserId: function(authorization){
        var idUser = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null){
            try {
                var jwtToken = jwt.verify(token, JWT_SIGNATURE);
                if(jwtToken != null){
                    idUser = jwtToken.idUser;
                }
            } catch (err) {
                console.log(err)
            }
        }
        return idUser;
    }
}