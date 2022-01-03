const { response } = require('express');

const validarRolAdmin = (req, res = response, next) => {

    const rol = req.rolToken;

    if (rol && rol != 'ROL_ADMIN') {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitidos: ROL_ADMIN'
        });
    }

    next();
}

module.exports = { validarRolAdmin }