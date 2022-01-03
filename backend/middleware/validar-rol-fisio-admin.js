const { response } = require('express');

const validarRolFisioAdmin = (req, res = response, next) => {

    const rol = req.rolToken;

    if (rol && rol != 'ROL_ADMIN' && rol != 'ROL_FISIO') {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitidos: ROL_ADMIN, ROL_FISIO'
        });
    }

    next();
}

module.exports = { validarRolFisioAdmin }