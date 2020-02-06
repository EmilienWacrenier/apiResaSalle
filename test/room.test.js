const chaiHttp = require('chai-http');
const server = require('../app');
const chai = require('chai');
const should = chai.should();

chai.use(chaiHttp);

/* describe('app', function() {
    it('/hello', function(done) {
        chai.request(server)
            .get('/hello')
            .end(function(err, res) {
                res.should.have.status(2001);
                res.should.be.json;
                done();
            });
    });
}); */

describe('Room tests', function() {
    it('/rooms', function(done) {
        chai.request(server)
            .get('/salle/rooms')
            .end(function(err, res) {
                console.log("sdsdsd");
                res.should.have.status(2001);
            });
        done();
    });
});
