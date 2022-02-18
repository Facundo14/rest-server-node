const { response } = require('express');
const { Producto } = require('../models');


const obtenerProductos = async(req, res = response) => {

    const {limite = 5, desde = 0 } = req.query;
    
    const query = { estado: true }
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        productos
    });
}

const obtenerProducto = async(req, res = response) => {
    
    const { id } = req.params;
    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    if(!producto){
        return res.status(401).json({
            ok: false,
            msg: 'La producto no existe'
        });    
    }
    
    res.json({
        ok: true,
        producto
    });
}

const crearProducto = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        res.status(400).json({
            ok: false,
            msg: `El producto ${ productoDB.nombre } ya existe en la base de datos`,
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    //Guardar en db
    await producto.save();

    res.status(201).json({
        ok: true,
        msg: 'Producto creado',
        producto
    });
}

const actualizarProducto = async(req, res = response) => {
    const { id } = req.params;

    const {estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});
    
    res.json({
        ok: true,
        msg: 'Producto actualizado',
        producto
    })
}


const borrarProducto = async(req, res = response) => {
    const { id } = req.params;

    //Borrado Lógico
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, {new: true});
    
    res.json({
        ok: true,
        msg: 'Producto eliminado',
        producto
    })
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    crearProducto,
    borrarProducto
}