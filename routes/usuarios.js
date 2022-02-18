const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const { 
    ususariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    validarCampos
], ususariosGet);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    validarJWT,
    check('correo', 'El correo no es válido').isEmail(),
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('password', 'El password es requerido').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 letras').isLength({min: 6}),
    check('correo', 'El nombre es requerido').not().isEmpty(),
    check('correo').custom( emailExiste ),
    check('rol', 'El rol es requerido').not().isEmpty(),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole exige que sea solo ADMIN_ROLE para poder hacer la petición
    //esAdminRole,

    //En cambio tieneRole le puedo especificar que ademas de ADMIN_ROLE puede tener alguno de los indicados para poder hacer la petición
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;