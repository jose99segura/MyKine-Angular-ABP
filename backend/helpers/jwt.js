const jwt = require('jsonwebtoken');

const generarJWT = (uid, rol) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid,
            rol
        }

        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '1y'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });

    });
}

module.exports = { generarJWT }