/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');
const { validarRol } = require('../middleware/validar-rol');

const router = Router();

router.get(
    "/", [
        validarJWT,
        // Campos opcionales, si vienen los validamos
        check("id", "El id de usuario debe ser válido").optional().isMongoId(),
        check("desde", "El desde debe ser un número").optional().isNumeric(),
        check("texto", "La busqueda debe contener texto").optional().trim(),
        validarCampos,
        validarRolAdmin,
    ],
    obtenerUsuarios);

router.post('/', [
    validarJWT,
    check('nombre_apellidos', 'El argumento nombre_apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
    validarRolAdmin,
    validarRol,
], crearUsuario);

router.put('/:id', [
    validarJWT,
    check('nombre_apellidos', 'El argumento nombre_apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin,
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin,
], borrarUsuario);


module.exports = router;