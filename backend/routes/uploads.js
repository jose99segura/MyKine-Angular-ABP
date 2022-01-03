/*
Ruta base: /api/upload
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { subirArchivo, enviarArchivo } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.get('/:tipo/:nombrearchivo', [
    validarJWT,
    check('nombrearchivo', 'El nombrearchivo debe ser válido').trim(),
    validarCampos,
], enviarArchivo);
router.post('/:tipo/:id', [
    validarJWT,
    check('id', 'El id debe ser válido').isMongoId(),
    validarCampos,
], subirArchivo);

module.exports = router;