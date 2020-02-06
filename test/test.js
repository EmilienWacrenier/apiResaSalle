let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp)

describe('/salle/rooms', () => {
    describe('test1', (done) => {
        chai.request(server)
        .get('/salle/rooms')
        .end((err, res) => {
            if(err){
                throw err;
            }
            res.should.have.status(200)
            done()
        })
    })
})