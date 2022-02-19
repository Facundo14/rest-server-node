const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { validarJWT, tieneRole, validarCampos, validarArchivoSubir } = require('../middlewares');
const { coleccionesPermitidias } = require('../helpers');


const router = Router();


router.post('/',[
    validarJWT,
    validarArchivoSubir,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    validarCampos
],cargarArchivo);

router.put('/:coleccion/:id',[
    validarJWT,
    validarArchivoSubir,
    check('id', 'El id debe ser un id válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidias(c, ['usuarios','productos'])),
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    validarCampos
],actualizarImagen);

router.get('/:coleccion/:id',[
    validarJWT,
    check('id', 'El id debe ser un id válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidias(c, ['usuarios','productos'])),
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    validarCampos
], mostrarImagen)

module.exports = router;