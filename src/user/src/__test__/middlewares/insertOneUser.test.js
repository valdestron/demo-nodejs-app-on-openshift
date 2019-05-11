const chai = require('chai')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
const proxyquire = require('proxyquire')
const assert = chai.assert
const requestInfo = {
  method: 'GET',
  url: '/users',
  body: {
    username: 'test',
    password: 'test'
  }
}

describe('Insert User Middleware', () => {
  let data = requestInfo
  let req = {}
  let res = {}
  let insertUserMiddleware
  let insertUserStub

  beforeEach((done) => {
    insertUserStub = sinon.stub()

    res = httpMocks.createResponse()

    insertUserStub.withArgs({ username: 'test', password: 'test' }).returns(true)
    insertUserStub.withArgs().throws('body')

    insertUserMiddleware = proxyquire('../../middlewares/insertUser', {
      '../repository/user': { insertUser: insertUserStub }
    })

    done()
  })

  afterEach((done) => {
    data = requestInfo
    done()
  })

  it('should insert user by id with 200 status code', async () => {
    req = httpMocks.createRequest(data)
    await insertUserMiddleware(req, res, (error) => {
      assert.isNotOk(error, 'error happened in insertUserMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 200, 'status code is not 200')
    })
  })

  it('should fail to insert user when body is malformed', async () => {
    req = httpMocks.createRequest({ ...data, body: undefined })
    await insertUserMiddleware(req, res, (error) => {
      assert.isOk(error, 'error was expected from insertUserMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 500, 'status code 500 expected')
    })
  })

})
