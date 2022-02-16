const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const ususariosGet = async(req, res = response) => {

    const {limite = 5, desde = 0 } = req.query;
    const query = { estado: true }


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en db
    await usuario.save();

    res.json({
        ok: true,
        msg: 'Usuario creado',
        usuario
    });
}
const usuariosPut = async(req, res = response) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO: validar contra base de datos
    if( password ){
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    
    res.json({
        ok: true,
        msg: 'put API',
        usuario
    })
}


const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Borrado Lógico
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    
    res.json({
        ok: true,
        usuario
    })
}

const usuariosPatch = (req, res = response) => {

    res.json({
        ok: true
    })
}


module.exports = {
    ususariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}