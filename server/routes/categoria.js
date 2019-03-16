const express = require('express')
const app = express()
const Categoria = require('../models/categoria')
const _= require('underscore')
const { verificarToken, verificarAdmin } = require('../middlewares/auth')

//  get all
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({estado: true}, '-estado')
      .populate('usuario', 'nombre email')
      .exec((err, categorias) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
              })
        }
        Categoria.count({estado: true}, (err, cont) => {
            res.json({
              ok: true,
              cont,
              categorias
            })
          })
    })
})

//  get by id
app.get('/categoria/:id', verificarToken, (req, res) => {
  let id = req.params.id
  Categoria.findById(id, '-estado').populate('usuario', 'nombre email').exec((err, categoria) =>{
    if (err) {
        return res.status(400).json({
            ok: false,
            err
          })
    }
    Categoria.count({estado: true}, (err, cont) => {
        res.json({
          ok: true,
          cont,
          categoria
        })
      })
  })
})

//  create new
app.post('/categoria', verificarToken, (req, res) => {
  let body = req.body
  let categoria = new Categoria({
    name: body.name,
    descripcion: body.descripcion,
    usuario: req.usuario._id
  })
  categoria.save((err, categoriaDB) =>{
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
})

//  modify
app.put('/categoria/:id', verificarToken, (req, res) => {
  let id = req.params.id
  let body = _.pick(req.body, ['name', 'descripcion'])
  Categoria.findByIdAndUpdate(id, body, {new:true, runValidators: true}, (err, categoriaDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
})

//  delete
app.delete('/categoria/:id', [verificarToken, verificarAdmin], (req, res) => {
  let id = req.params.id
  Categoria.findByIdAndUpdate(id, {estado: false}, {new:true, runValidators: true}, (err, categoriaDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }
    if (!categoriaDB.estado) {
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