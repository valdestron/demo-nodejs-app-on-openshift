const chai = require('chai')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
const proxyquire = require('proxyquire')
const assert = chai.assert
const requestInfo = {
  method: 'GET',
  url: '/users',
}

describe('Find All Users Middleware', () => {
  let data = requestInfo
  let req = {}
  let res = {}
  let findUsersMiddleware
  let getUsersStub

  beforeEach((done) => {
    getUsersStub = sinon.stub()
    req = httpMocks.createRequest(data)
    res = httpMocks.createResponse()

    done()
  })

  afterEach((done) => {
    data = requestInfo
    done()
  })

  it('should get all users with 200', async () => {
    getUsersStub.withArgs().returns(true)

    findUsersMiddleware = proxyquire('../../middlewares/findAllUsers', {
      '../repository/user': { getUsers: getUsersStub }
    })

    await findUsersMiddleware(req, res, (error) => {
      assert.isNotOk(error, 'error happened in findUsersMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 200, 'status code is not 200')
    })
  })

  it('should fail to get users when repository does not respond', async () => {
    getUsersStub.withArgs().throws('database')

    findUsersMiddleware = proxyquire('../../middlewares/findAllUsers', {
      '../repository/user': { getUsers: getUsersStub }
    })

    await findUsersMiddleware(req, res, (error) => {
      assert.isOk(error, 'error was expected from findUsersMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 500, 'status code 500 expected')
    })
  })

})
