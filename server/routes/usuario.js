const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt= require('bcrypt-nodejs')
const _= require('underscore')
const { verificarToken, verificarAdmin } = require('../middlewares/auth')

app.get('/usuario', verificarToken, function (req, res) {
  let from  = Number(req.query.from) || 0
  let lim   = Number(req.query.lim) || 5
  Usuario.find({estado: true}, 'nombre email rol img estado google').skip(from).limit(lim).exec((err,usuarios) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }
    Usuario.count({estado: true}, (err, cont) => {
      res.json({
        ok: true,
        cont,
        usuarios
      })
    })
  })
})

app.post('/usuario', [verificarToken, verificarAdmin],function (req, res) {
  let body = req.body
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    pass: bcrypt.hashSync(body.pass),
    rol: body.rol
  })
  usuario.save((err, usuarioDB) =>{
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

app.put('/usuario/:id', [verificarToken, verificarAdmin], function (req, res) {
  let id = req.params.id
  let body = _.pick(req.body, ['nombre', 'img', 'email', 'rol', 'estado'])
  Usuario.findByIdAndUpdate(id,body, {new:true, runValidators: true}, (err, usuarioDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

/*
  app.delete('/usuario/:id', function (req, res) {
    Usuario.findByIdAndRemove(req.params.id, {}, (err, usuarioBorrado) =>{
      if (err) {
        res.status(400).json({
          ok: false,
          err
        })
      }
      if (!usuarioBorrado) {
        res.status(400).json({
          ok: false,
          err: {
            message: 'El usuario no existe'
          }
        })
      }
      res.json({
        ok:true,
        usuario: usuarioBorrado
      })
    })
  })
*/

app.delete('/usuario/:id', [verificarToken, verificarAdmin], function (req, res) {
  let id = req.params.id
  Usuario.findByIdAndUpdate(id,{estado: false}, {new:true, runValidators: false}, (err, usuarioDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }
    if (!usuarioDB.estado) {
      return res.json({
        ok: false,
        err: {
          message: 'registro ya borrado'
        }
      })
    }
  })
})

module.exports = app