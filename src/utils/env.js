const path = require('path')
const envPath = path.join(__dirname.replace(path.basename(__dirname), '../.env'))
require('dotenv').load({ path: envPath })
