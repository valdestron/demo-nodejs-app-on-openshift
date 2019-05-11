const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')

const expect = chai.expect
chai.use(sinonChai)
chai.should()

describe('Express server', () => {
  let stubExpress
  let stubHttp
  let spyExpressGet
  let spyExpressUse
  let spyExpressPost
  let spyExpressDelete
  let fakeExpress
  let fakeCreatedServer
  let server
  const fakeServer = {}

  beforeEach(() => {
    spyExpressGet = sinon.spy()
    spyExpressUse = sinon.spy()
    spyExpressPost = sinon.spy()
    spyExpressDelete = sinon.spy()

    fakeExpress = {
      get: spyExpressGet,
      use: spyExpressUse,
      post: spyExpressPost,
      delete: spyExpressDelete,
    }

    fakeCreatedServer = {
      on: sinon.spy(),
      listen: sinon.spy()
    }

    stubExpress = sinon.stub().returns(fakeExpress)
    stubHttp = {
      createServer: sinon.stub().returns(fakeCreatedServer)
    }

    server = proxyquire('../server', {
      express: stubExpress,
      http: stubHttp
    })

    Object.assign(fakeServer, fakeCreatedServer)
  })

  it('should return expected http server', async () => {
    const loadedServer = await server.loadServer()
    expect(loadedServer).to.eql(fakeServer)
  })
})
