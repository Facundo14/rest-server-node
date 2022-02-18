const {Schema, model} = require('mongoose')

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    img: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    }
});

CategoriaSchema.methods.toJSON = function(){
    const {__v, estado, ...categoria} = this.toObject();
    return categoria;
}

module.exports = model('Categoria', CategoriaSchema);