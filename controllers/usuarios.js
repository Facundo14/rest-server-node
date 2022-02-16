const { response } = require('express')

const ususariosGet = (req, res = response) => {

    const {id, page = "1", limit} = req.query

    res.json({
        ok: true,
        msg: 'get API - controlador',
        id,
        page,
        limit
    });
}

const usuariosPut = (req, res = response) => {
    
    const id = req.params.id;
    
    res.json({
        ok: true,
        msg: 'put API',
        id
    })
}

const usuariosPost = (req, res = response) => {
    const body = req.body;
    //se puede desestructurar e ignorar todo aquello que venga que no quieras ver const {nombre, edad} = req.body;
    res.json({
        ok: true,
        msg: 'post API',
        body
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete API'
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'patch API'
    })
}


module.exports = {
    ususariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}