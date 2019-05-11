const chai = require('chai')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
const proxyquire = require('proxyquire')
const assert = chai.assert
const requestInfo = {
  method: 'GET',
  url: '/users',
  params: {
    id: 1
  }
}

describe('Find One User Middleware', () => {
  let data = requestInfo
  let req = {}
  let res = {}
  let findUserMiddleware
  let getUserStub

  beforeEach((done) => {
    getUserStub = sinon.stub()

    res = httpMocks.createResponse()

    getUserStub.withArgs(1).returns(true)
    getUserStub.withArgs().throws('id')

    findUserMiddleware = proxyquire('../../middlewares/findOneUser', {
      '../repository/user': { findById: getUserStub }
    })

    done()
  })

  afterEach((done) => {
    data = requestInfo
    done()
  })

  it('should get user by id with 200 status code', async () => {
    req = httpMocks.createRequest(data)
    await findUserMiddleware(req, res, (error) => {
      assert.isNotOk(error, 'error happened in findUserMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 200, 'status code is not 200')
    })
  })

  it('should fail to get user when no id in params', async () => {
    req = httpMocks.createRequest({ ...data, params: null })
    await findUserMiddleware(req, res, (error) => {
      assert.isOk(error, 'error was expected from findUserMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 500, 'status code 500 expected')
    })
  })

})
