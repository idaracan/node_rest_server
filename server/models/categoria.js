const mongoose = require('mongoose')
const uniqueVal= require('mongoose-unique-validator')

let Schema = mongoose.Schema

let categoriaSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario' 
    } ,
    estado:{
        type: Boolean,
        default: true
    }
})

categoriaSchema.plugin(uniqueVal,{message: '{PATH} debe ser único'})
module.exports = mongoose.model('Categoria', categoriaSchema)