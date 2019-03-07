const express = require('express')
const app = express()

// parse routes
app.use(require('./usuario'))
app.use(require('./login'))

module.exports = app