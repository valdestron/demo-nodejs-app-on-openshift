const { Model } = require('objection')

class User extends Model {
  static get tableName() {
    return 'users'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 4095 }
      }
    }
  }
}

module.exports = User
