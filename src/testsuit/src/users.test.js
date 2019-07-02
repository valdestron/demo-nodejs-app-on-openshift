require('../env')
const chai = require('chai')
const chaiHttp = require('chai-http')
const parse = require('date-fns/parse')

chai.use(chaiHttp)
const expect = chai.expect

const APP_URL = process.env.APP_URL || 'http://localhost:30030'

describe('User API Routes', () => {

  describe('GET /users', () => {
    it('should return all users', async () => {
      const res = await chai.request(APP_URL).get('/users')
      expect(res.status).to.equal(200)
      expect(res).to.be.json
      expect(res.body).be.an('object')
      expect(res.body.data[0].username).to.equal('demo')
      expect(res.body.data[0].id).to.equal(1)
      expect(parse(res.body.data[0].name)).to.not.be.undefined
      expect(res.body.data[0].password).to.be.undefined
    })
  })

  describe('POST /users', () => {
    it('should create new user', async () => {
      const res = await chai.request(APP_URL)
        .post('/users')
        .send({ username: 'test', password: 'unencryptedFrontendPassword', name: 'test' })

      expect(res.status).to.equal(200)
      expect(res).to.be.json
      expect(res.body).be.an('object')
      expect(Object.keys(res.body.data)).to.have.lengthOf(3)
      expect(res.body.data.username).to.equal('test')
      expect(res.body.data.id).to.not.be.undefined
      expect(res.body.data.name).to.not.be.undefined
    })
  })

  describe('GET /users/:id', () => {
    it('should find user by id = 1', async () => {
      const res = await chai.request(APP_URL).get('/users/1')
      expect(res.status).to.equal(200)
      expect(res).to.be.json
      expect(res.body).be.an('object')
      expect(Object.keys(res.body.data)).to.have.lengthOf(3)
      expect(res.body.data.username).to.equal('demo')
      expect(res.body.data.name).to.not.be.undefined
    })
  })

  describe('DELETE /users/:id', () => {
    it('should delete user by id = 2', async () => {
      const res = await chai.request(APP_URL).delete('/users/2')
      expect(res.status).to.equal(200)
      expect(res).to.be.json
      expect(res.body.data).to.be.undefined
    })
  })

})
