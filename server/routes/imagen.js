const express = require('express')
const fs = require('fs')
const path = require('path')
const { verificarTokenImg } = require('../middlewares/auth')

const app = express()

app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
    const tipo = req.params.tipo
    const img = req.params.img
    
    const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
    const noImgPath = path.resolve(__dirname, '../assets/no-image.jpg')
    
    if (!fs.existsSync(pathImg)) {
        return res.sendFile(noImgPath)
    }
    return res.sendFile(pathImg)
})
  
module.exports = app