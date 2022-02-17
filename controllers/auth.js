const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Ususario / Password no son correctos - correo'
            });
        }

        // Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                ok: false,
                msg: 'Ususario / Password no son correctos - estado: false'
            });
        }

        //verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Ususario / Password no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });  
    }
}



module.exports = {
    login
}