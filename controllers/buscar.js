const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'usuarios',
    'rol',
];

const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const usuario = await Usuario.findById(termino);
        return res.json({
             ok: true,
             resutlts: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const [usuario, total] = await Promise.all([
        Usuario.find({ 
            $or: [ {nombre: regex}, {correo: regex} ],
            $and: [ {estado: true} ]
         }),
         Usuario.countDocuments({ 
            $or: [ {nombre: regex}, {correo: regex} ],
            $and: [ {estado: true} ]
         })
    ]);

    res.json({
        ok: true,
        cantidad: total,
        resutlts: usuario
   });

}

const buscarCategorias = async(termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const categoria = await Categoria.findById(termino);
        return res.json({
             ok: true,
             resutlts: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const [categoria, total] = await Promise.all([
        Categoria.find({ nombre: regex, estado: true }),
        Categoria.countDocuments({ nombre: regex, estado: true})
    ]);

    res.json({
        ok: true,
        cantidad: total,
        resutlts: categoria
   });

}

const buscarProductos = async(termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const producto = await Producto.findById(termino).populate('usuario','nombre').populate('categoria', 'nombre');
        return res.json({
             ok: true,
             resutlts: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const [producto, total] = await Promise.all([
        Producto.find({ nombre: regex, estado: true }).populate('usuario','nombre').populate('categoria', 'nombre'),
        Producto.countDocuments({ nombre: regex, estado: true})
    ]);

    res.json({
        ok: true,
        cantidad: total,
        resutlts: producto
   });

}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes( coleccion )){
        res.status(400).json({
            ok: false,
            msg: `La coleccion ${ coleccion } que intenta buscar no esta dentro de las permitidas las cuales son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos( termino, res);
        break;
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
    
        default:
            res.status(500).json({
                ok: false,
                msg: 'Se me olvido de hacer esta busqueda'
            });
    }

}


module.exports = {
    buscar
}