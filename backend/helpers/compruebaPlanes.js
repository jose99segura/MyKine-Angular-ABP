const Usuario = require('../models/usuarios');

const compruebaPlanes = (fisio) => {
    if (fisio.planMensual == "Gratis") {
        return 1;
    }
    if (fisio.planMensual == "Estandar") {
        return 10;
    }
    if (fisio.planMensual == "Premium") {
        return 25;
    }

}

module.exports = { compruebaPlanes }