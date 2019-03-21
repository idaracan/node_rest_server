const express = require('express')
const {verificarToken} = require('../middlewares/auth')
const _= require('underscore')

const app = express()
let Producto = require('../models/producto')

//  get all (paginated)
app.get('/producto', verificarToken, (req, res) => {
    const from  = req.query.from || 0
    const lim   = req.query.lim || 10
    Producto.find()
        .skip(from)
        .limit(lim)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Producto.count({disponible: true},(err, cont) => {
                res.json({
                    ok: true,
                    cont,
                    producto
                  })
            })
        })
})

// find by name

app.get('/producto/buscar/:termino', (req, res) => {
    const termino = req.params.termino
    const regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Producto.count({disponible: true},(err, cont) => {
                res.json({
                    ok: true,
                    cont,
                    producto
                  })
            })
        })
})

//  get one
app.get('/producto/:id', (req, res) => {
    const id = req.params.id
    Producto.findById(id).populate('usuario', 'nombre email').exec((err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        Producto.count(true ,(err, cont) => {
            res.json({
                ok: true,
                cont,
                producto
              })
        })
    })
})

//  create new
app.post('/producto', verificarToken, (req, res) => {
    const body = req.body
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

//  modify
app.put('/producto/:id', verificarToken, (req, res) => {
    const id = req.params.id
    const update = _.pick(req.body, ['nombre', 'precioUni', 'descripcion'])
    Producto.findOneAndUpdate(id, update, {new:true, runValidators: true}, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
          })
    })
})

//  delete
app.delete('/producto/:id', verificarToken, (req, res) => {
    const id = req.params.id
    Producto.findByIdAndUpdate(id, {disponible: false}, {new:true, runValidators: true}, (err, productoDB) => {
        if (err) {
          res.status(400).json({
            ok: false,
            err
          })
        }
        if (!productoDB.disponible) {
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