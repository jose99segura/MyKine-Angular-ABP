/*
Ruta base: /api/informes
*/

const { Router } = require('express');
const { obtenerInformes, crearInforme, eliminarInforme } = require('../controllers/informes');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
//const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolFisio } = require('../middleware/validar-rol-fisio');
//const { validarRolAdmin } = require('../middleware/validar-rol-admin');
//const { validarRolFisioAdmin } = require('../middleware/validar-rol-fisio-admin');


const router = Router();

router.get('/:id', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarRolFisio,
], obtenerInformes);

router.post('/:id', [
    validarJWT,
    check('titulo', 'El argumento titulo es obligatorio').not().isEmpty().trim(),
    check('contenido', 'El argumento contenido es obligatorio').not().isEmpty().trim(),
    validarCampos,
    validarRolFisio,
], crearInforme);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisio,
], eliminarInforme);


module.exports = router;