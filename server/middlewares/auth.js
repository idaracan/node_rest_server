const jwt = require('jsonwebtoken')
// verificar token
let verificarToken = (req, res, next)=>{
    let token = req.get('token')
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok : false,
                err: {
                    message: "Token invalido"
                }
            })
        }
        req.usuario = decoded.usuario
        next()
    })
}
// verificar Admin
let verificarAdmin = (req, res, next) => {
    let rol = req.usuario.rol
    if (rol === 'ADMIN_ROLE') {
        next()
    } else {
        return res.status(401).json({
            ok : false,
            err: {
                message: "usuario invalido"
            }
        })
    }
}
module.exports = {
        verificarToken,
        verificarAdmin
    }