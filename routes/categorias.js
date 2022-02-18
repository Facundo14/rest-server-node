const { Router } = require('express');
const { check } = require('express-validator');

const { existeCategoria } = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const { 
    obtenerCategorias, 
    actualizarCategoria, 
    borrarCategoria, 
    obtenerCategoria,
    crearCategoria} = require('../controllers/categorias');

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    validarCampos
], crearCategoria);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    validarCampos
], actualizarCategoria);


router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria);



module.exports = router;