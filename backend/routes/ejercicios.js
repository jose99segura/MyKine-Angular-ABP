/*
Ruta base: /api/ejercicios
*/

const { Router } = require('express');
const { obtenerEjercicios, crearEjercicio, actualizarEjercicio, eliminarEjercicio } = require('../controllers/ejercicios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
//const { validarRolFisio } = require('../middleware/validar-rol-fisio');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');


const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerEjercicios);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty().trim(),
    check('imagen', 'El argumento imagen es obligatorio').not().isEmpty().trim(),
    check('tipo', 'El argumento tipo es obligatorio').not().isEmpty().trim(),
    validarCampos,
    validarRolAdmin,
], crearEjercicio);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty().trim(),
    check('imagen', 'El argumento imagen es obligatorio').not().isEmpty().trim(),
    check('tipo', 'El argumento tipo es obligatorio').not().isEmpty().trim(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin,
], actualizarEjercicio);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin,
], eliminarEjercicio);


module.exports = router;