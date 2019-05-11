const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')

chai.use(sinonChai)
chai.should()

describe('Routes', () => {
  let spyHealth
  let spyFindAllUsers
  let spyFindOneUser
  let spyInsertUser
  let spyDestroyUser

  let spyAppGet
  let spyAppPost
  let spyAppDelete

  let fakeApp
  let routes

  beforeEach(() => {
    spyHealth = sinon.spy()
    spyFindAllUsers = sinon.spy()
    spyFindOneUser = sinon.spy()
    spyInsertUser = sinon.spy()
    spyDestroyUser = sinon.spy()
    spyAppGet = sinon.spy()
    spyAppPost = sinon.spy()
    spyAppDelete = sinon.spy()

    fakeApp = {
      get: spyAppGet,
      post: spyAppPost,
      delete: spyAppDelete
    }

    routes = proxyquire('../../routes', {
      '../middlewares/health': spyHealth,
      '../middlewares/findAllUsers': spyFindAllUsers,
      '../middlewares/findOneUser': spyFindOneUser,
      '../middlewares/insertUser': spyInsertUser,
      '../middlewares/destroyUser': spyDestroyUser,
    })

    routes(fakeApp)
  })

  it('should setup get /health route', () => {
    spyAppGet.should.have.been.calledWithExactly('/health', spyHealth)
  })

  it('should setup get /users getroute', () => {
    spyAppGet.should.have.been.calledWithExactly('/users', spyFindAllUsers)
  })

  it('should setup get /users/:id route', () => {
    spyAppGet.should.have.been.calledWithExactly('/users/:id', spyFindOneUser)
  })

  it('should setup post /users route', () => {
    spyAppPost.should.have.been.calledWithExactly('/users', spyInsertUser)
  })

  it('should setup delete /users/:id route', () => {
    spyAppDelete.should.have.been.calledWithExactly('/users/:id', spyDestroyUser)
  })
})
