const chai = require('chai')
const { response } = require('../../utils')
chai.should

describe('Utils', () => {

  describe('response()', () => {
    it('should return object with status if no arguments', (done) => {
      const result = response()
      result.should.have.property('status').that.is.a('boolean')
      done()
    })
  })

  describe('response(data)', () => {
    it('should return formed response object', (done) => {
      const data = { test: 1 }
      const result = response(data)
      result.should.have.property('status').that.is.a('boolean')
      result.should.have.property('data').that.is.a('object')
      result.data.should.have.property('test', 1)
      done()
    })
  })

  describe('response(data, 500)', () => {
    it('should return result with status false if status provided', (done) => {
      const data = { test: 1 }
      const result = response(data, 500)
      result.should.have.property('status').that.is.a('boolean')
      result.status.should.be.false
      done()
    })
  })

})
