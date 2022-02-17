const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async( req, res = response) => {
    const {id_token} = req.body;

    try {
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if(!usuario){
            //Tengo que crear el usuario
            const data = {
                nombre,
                correo,
                password: ':D',
                img,
                google: true
            };  

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                ok: false,
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {

        console.log(error)
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        }); 
        
    }

}



module.exports = {
    login,
    googleSignIn
}