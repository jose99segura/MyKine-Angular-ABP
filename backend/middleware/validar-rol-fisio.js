const { response } = require('express');

const validarRolFisio = (req, res = response, next) => {

    const rol = req.rolToken;

    if (rol && rol != 'ROL_FISIO') {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitidos: ROL_FISIO'
        });
    }

    next();
}

module.exports = { validarRolFisio }