const { response } = require('express');
const { Categoria } = require('../models');


const obtenerCategorias = async(req, res = response) => {

    const {limite = 5, desde = 0 } = req.query;
    
    const query = { estado: true }
    
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        categorias
    });
}

const obtenerCategoria = async(req, res = response) => {
    
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if(!categoria){
        return res.status(401).json({
            ok: false,
            msg: 'La categoria no existe'
        });    
    }
    
    res.json({
        ok: true,
        categoria
    });
}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if(categoriaDB){
        res.status(400).json({
            ok: false,
            msg: `La categoria ${ categoriaDB.nombre } ya existe en la base de datos`,
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria( data );

    //Guardar en db
    await categoria.save();

    res.status(201).json({
        ok: true,
        msg: 'Categoria creada',
        categoria
    });
}

const actualizarCategoria = async(req, res = response) => {
    const { id } = req.params;

    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
    
    res.json({
        ok: true,
        msg: 'Categoria Actualizada',
        categoria
    })
}


const borrarCategoria = async(req, res = response) => {
    const { id } = req.params;

    //Borrado Lógico
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true});
    
    res.json({
        ok: true,
        msg: 'Categoria eliminada',
        categoria
    })
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    crearCategoria,
    borrarCategoria
}