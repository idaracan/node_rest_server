const express = require('express')
const bcrypt= require('bcrypt-nodejs')
const jwt   = require('jsonwebtoken')
const app = express()
const Usuario = require('../models/usuario')

app.post('/login', (req, res) => {
    let body = req.body
    Usuario.findOne({email: body.email},(err,usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
              })
        }
        if ((!usuarioDB) || (!bcrypt.compareSync(body.pass,usuarioDB.pass))) {
            return res.status(400).json({
                message: "usuario o contraseña incorrectos"
            })
        }
        let token = jwt.sign({usuario: usuarioDB},process.env.SEED,{expiresIn: process.env.expiresIn})
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        }) 
    })
})

module.exports = app