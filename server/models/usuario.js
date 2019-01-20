const mongoose = require('mongoose')
const uniqueVal= require('mongoose-unique-validator')
let Schema = mongoose.Schema
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    pass:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: false
    },
    rol:{
        type: String,
        default: 'ADMIN_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
})
usuarioSchema.plugin(uniqueVal,{message: '{PATH} debe ser único'})
module.exports = mongoose.model('Usuario', usuarioSchema)