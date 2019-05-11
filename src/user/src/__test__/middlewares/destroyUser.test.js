const chai = require('chai')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
const proxyquire = require('proxyquire')
const assert = chai.assert
const requestInfo = {
  method: 'DELETE',
  url: '/users',
  params: {
    id: 1
  }
}

describe('Destroy User Middleware', () => {
  let data = requestInfo
  let req = {}
  let res = {}
  let destroyUserMiddleware

  beforeEach((done) => {
    const destroyUserStub = sinon.stub()
    destroyUserStub.withArgs(1).returns(true)
    destroyUserStub.withArgs().throws('id')

    res = httpMocks.createResponse()
    destroyUserMiddleware = proxyquire('../../middlewares/destroyUser', {
      '../repository/user': { destroyUser: destroyUserStub }
    })

    done()
  })

  afterEach((done) => {
    data = requestInfo
    done()
  })

  it('should successfully destroy user by id', async () => {
    req = httpMocks.createRequest(data)
    await destroyUserMiddleware(req, res, (error) => {
      assert.isNotOk(error, 'error happened in the destroyUserMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 200, 'status code is not 200')
    })
  })

  it('should fail to destroy user as id is not provided', async () => {
    req = httpMocks.createRequest({ ...data, params: null })
    await destroyUserMiddleware(req, res, (error) => {
      assert.isOk(error, 'error was expected from destroyUserMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 500, 'status code 500 expected')
    })
  })

})
