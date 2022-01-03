/*
Ruta base: /api/rutinas
*/

const { Router } = require('express');
const { obtenerRutinas, crearRutina, actualizarRutina, eliminarRutina, agregarRutinaCliente, quitarRutinaCliente } = require('../controllers/rutinas');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
//const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolFisio } = require('../middleware/validar-rol-fisio');
//const { validarRolAdmin } = require('../middleware/validar-rol-admin');
const { validarRolFisioAdmin } = require('../middleware/validar-rol-fisio-admin');


const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerRutinas);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty().trim(),
    check('imagen', 'El argumento imagen es obligatorio').not().isEmpty().trim(),
    check('ejercicios', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], crearRutina);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty().trim(),
    check('imagen', 'El argumento imagen es obligatorio').not().isEmpty().trim(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], actualizarRutina);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], eliminarRutina);

router.put('/ar/:id', [ // ar agregar rutina + ID rutina
    validarJWT,
    //check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], agregarRutinaCliente);

router.put('/qr/:id', [ // qr quitar rutina + ID rutina
    validarJWT,
    //check('nombre', 'El argumento nomnbre es obligatorio').not().isEmpty().trim(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolFisioAdmin,
], quitarRutinaCliente);


module.exports = router;