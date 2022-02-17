const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leer el usuario que corresponde el uid
        const usuario = await Usuario.findById( uid );

        //si el usuario da undefine osea no existe en la base de datos
        if(!usuario){
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido - Usuario no existe en DB'
            });
        }

        //Validar si el usuario tiene estado en true
        if(!usuario.estado){
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido - Usuario estado: false'
            });
        }


        req.usuario = usuario;
        next();
    } catch (error) {
        
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

}


module.exports = {
    validarJWT
}