const express = require('express')
const bcrypt= require('bcrypt-nodejs')
const jwt   = require('jsonwebtoken')
const app = express()
const Usuario = require('../models/usuario')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

//  google config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    return {
        name:   payload.name,
        email:  payload.email,
        img:    payload.picture,
        google: true
    }
}

app.post('/googlelogin', async (req, res) => {
    let idtoken = req.body.idtoken
    let googleUser = await verify(idtoken).catch(err => {
        return res.status(403).json({
            ok: false,
            error: err
        })
    })
    Usuario.findOne({email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (usuarioDB){
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: "debe autenticarse con Google"
                })  
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, {expiresIn: process.env.expiresIn})
                return res.json({
                    ok: true,
                    token,
                    googleToken: idtoken
                })
            }
        } else {
            // el usuario no existe
            let usuario = new Usuario()
            usuario.nombre  = googleUser.name
            usuario.email   = googleUser.email
            usuario.img     = googleUser.picture
            usuario.google  = true
            usuario.pass    = 'this is a new pass'
            usuario.save( (err, usuarioDB) => {
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, {expiresIn: process.env.expiresIn})
                return res.json({
                    ok: true,
                    token,
                    googleToken: idtoken
                })
            })
        }
    })
})

module.exports = app