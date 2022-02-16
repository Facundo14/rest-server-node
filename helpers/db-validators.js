const Role = require('../models/rol');
const Usuario = require('../models/usuario');

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


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}