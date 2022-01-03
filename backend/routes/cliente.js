/*
Ruta base: /api/cliente
*/

const { Router } = require('express');
const router = Router();

const { obtenerClientes, crearCliente, cambiarPassword, borrarCliente } = require('../controllers/cliente');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolFisioAdmin } = require('../middleware/validar-rol-fisio-admin');
const { validarRolFisio } = require('../middleware/validar-rol-fisio');

//Aqui se realizarán las validaciones para la gestión de los clientes

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'La busqueda debe contener texto').optional().trim(),
    validarCampos,
    validarRolFisioAdmin,
], obtenerClientes);

router.post('/', [
    validarJWT,
    check('nombre_apellidos', 'El argumento nombre_apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    //check('password', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
    validarRolFisioAdmin,
], crearCliente);

//El usuario deberá introducir primero la contraseña antigua por motivos de seguridad
//y luego la nueva contraseña y repetirla 
router.put('/np/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    //check('password', 'El argumento password es obligatorio').not().isEmpty().trim(),
    check('nuevopassword', 'El argumento nuevopassword es obligatorio').not().isEmpty().trim(),
    check('nuevopassword2', 'El argumento nuevopassword2 es obligatorio').not().isEmpty().trim(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
], cambiarPassword);


router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], borrarCliente);

module.exports = router;