const chai = require('chai')
const { getUsers, findById, insertUser, destroyUser } = require('../../repository/user')
const expect = chai.expect
chai.should()

describe('User DAO', () => {

  const newUser = {
    username: 'test',
    password: 'test',
    name: 'test'
  }

  describe('getUsers() query', () => {
    it('should get all users', async () => {
      const users = await getUsers()
      users.should.be.an('array')
      users[0].id.should.exist
      users[0].username.should.exist
      users[0].name.should.exist
    })
  })

  describe('insertUser(data) query', () => {
    it('should able to insert user with correct data', async () => {
      const { username, name, id } = await insertUser(newUser)

      username.should.exist
      id.should.exist
      name.should.exist
    })

    it('should throw if data incorrect', async () => {
      const badUser = {
        username: 'test',
      }

      let error

      try {
        await insertUser(badUser)
      } catch (e) {
        error = e
      }

      error.should.exist
    })
  })

  describe('destroyUser(id) query', () => {
    it('should be able to destroy user', async () => {
      try {
        const { id } = await insertUser(newUser)
        await destroyUser(id)
      } catch (e) {
        throw new Error('Should not throw')
      }
    })

    it('should not be able to destroy user with invalid id', async () => {
      let result

      try {
        result = await destroyUser('NaN')
      // eslint-disable-next-line no-empty
      } catch (e) {}
      expect(result).to.be.undefined
    })
  })

  describe('findById(id) query', () => {
    it('should be able to find user', async () => {
      try {
        const { id } = await insertUser(newUser)
        await findById(id)
      } catch (e) {
        throw new Error('Should not throw')
      }
    })

    it('should not able to find user with invalid id', async () => {
      const result = await findById(null)
      expect(result).to.be.undefined
    })
  })
})
