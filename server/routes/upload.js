const express = require('express')
const fileUpl = require('express-fileupload')
const { verificarToken } = require('../middlewares/auth')
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')
const app     = express()

app.use(fileUpl())

const validExtensions = ['png', 'jpg', 'jpeg', 'gif']
const validTypes = ['products', 'users']

app.put('/upload/:tipo/:id', verificarToken, (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: 'file not selected'
        })
    }
    // recoge datos de entrada
    const file = req.files.file
    const filename = file.name.split('.')
    const extension = filename.length - 1
    const tipo = req.params.tipo
    const id   = req.params.id
    // valida ruta/tipo de upload
    if (!validTypes.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: 'not a valid type'
        })
    }
    // valida extensión de archivo
    if (!validExtensions.includes(filename[extension])) {
        return res.status(400).json({
            ok: false,
            err: 'not a valid format'
        })
    }
    // construye el nombre del archivo
    let newFileName = `${id}-${new Date().getTime()}.${filename[extension]}`
    // sube archivo
    file.mv(`uploads/${tipo}/${newFileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })    
        }
        switch (tipo) {
            case 'users':
                changeUserImg(id, newFileName, res);
                break;
            case 'products':
                changeProductImg(id, newFileName, res);
                break;
            default:
                break;
        }
    })
})

function changeProductImg(id, newFileName, res) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            deleteFile(newFileName, 'products');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB){
            deleteFile(newFileName, 'products');
            return res.status(404).json({
                ok: false,
                err: 'producto not found'
            });
        }        
        deleteFile(productoDB.img, 'products');
        productoDB.img = newFileName
        productoDB.save((err, updatedProduct) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err: 'error on upload'
                });
            }
            return res.json({
                ok: true,
                product: updatedProduct,
                msg: 'file uploaded'
            })
        })
    })
}

function changeUserImg(id, newFileName, res) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            deleteFile(newFileName, 'users');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            deleteFile(newFileName, 'users');
            return res.status(404).json({
                ok: false,
                err: 'usuario not found'
            });
        }
        deleteFile(usuarioDB.img, 'users');
        usuarioDB.img = newFileName
        usuarioDB.save((err, updatedUser) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err: 'error on upload'
                });
            }
            return res.json({
                ok: true,
                product: updatedUser,
                msg: 'file uploaded'
            })
        })
    })
}

function deleteFile(name, tipo) {
    const filePath = path.resolve(__dirname, `../../uploads/${tipo}/${name}`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

module.exports = app