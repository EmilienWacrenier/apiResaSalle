module.exports = {
    checkParam: function(req, expectedKeys) {
        const keys = Object.keys(req.query);
        var toReturn = null
        expectedKeys.forEach(key => {
            if (!keys.includes(key)) {
                toReturn = {
                    code: 400,
                    result: "Le paramètre " + key + " est manquant"
                }
            }
        });
        return toReturn
    },

    checkBody: function(req, expectedBody) {
        const keys = Object.keys(req.body);
        var toReturn = null
        expectedBody.forEach(key => {
            if (!keys.includes(key)) {
                toReturn = {
                    code: 400,
                    result: "Le paramètre " + key + " est manquant"
                }
            }
        });
        return toReturn
    }
}