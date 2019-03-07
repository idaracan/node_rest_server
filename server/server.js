require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//  add various routes
app.use(require('./routes/index'))

mongoose.connect(process.env.urlDb, (err, res) =>{
  if (err) {
    throw err
  }
  console.log('Base de datos online')
  
})

app.listen(process.env.PORT,()=>{
    console.log(`escuchando puerto ${process.env.PORT}`);
})