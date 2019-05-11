const { general } = require('../configuration')

if (general.appOnTest) {
  const sqlite3 = require('sqlite3').verbose()
  new sqlite3.Database(':memory:')
}
