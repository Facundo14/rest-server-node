const { Usuario, Categoria, Producto } = require('../models');
const Role = require('../models/rol');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if( !existeRol ){
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
    const existeCorreo = await Usuario.findOne({correo});
    if( existeCorreo ){
        throw new Error(`El correo ${ correo } ya existe en la base de datos`);
    }
}

const existeUsuarioPorId = async(id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ){
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeCategoria = async(id = '') => {
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ){
        throw new Error(`La categoria con el id ${ id } no existe`);
    }
}

const existeProducto = async(id = '') => {
    const existeProducto = await Producto.findById(id);
    if( !existeProducto ){
        throw new Error(`El producto con el id ${ id } no existe`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}