const chai = require('chai')
const httpMocks = require('node-mocks-http')
const assert = chai.assert

describe('Health Middleware', () => {
  let req = {}
  let res = {}
  const healthMiddleware = require('../../middlewares/health')

  beforeEach((done) => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/health'
    })
    res = httpMocks.createResponse()

    done()
  })

  it('should response with success', (done) => {
    healthMiddleware(req, res, (error) => {
      assert.isNotOk(error, 'error happened in the healthMiddleware')
      assert.equal(res.finished, true, 'response is not finished')
      assert.equal(res.statusCode, 200, 'status code is not 200')
      done()
    })
  })

})
