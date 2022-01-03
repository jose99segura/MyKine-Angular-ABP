const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    //Campos comunes
    nombre_apellidos: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    imagen: {
        type: String, //File??
    },
    rol: {
        type: String,
        require: true,
    },
    estadisticas: {
        type: String,
        default: "",
    },
    alta: {
        type: Date,
        default: Date.now,
    },
    activo: {
        type: Boolean,
        default: true,
    },

    //Metodos Fisio

    planMensual: {
        type: String,
        //require: true
    },
    num_clientes: {
        type: Number,
        default: 0
    },
    rutinas: [{
        type: Schema.Types.ObjectId,
        ref: "Rutina"
    }, ],
    sitio_Fisio: {
        nombre_sitio: {
            type: String,
            unique: true
        },
        imagen_sitio: {
            type: String //File??
        },
        localizacion_sitio: {
            type: String, //Ya veremos como lo guardamos¿?
            require: true,
            unique: true
        }
    },
    tarjeta_Fisios: {
        nombre_tarjeta: {
            type: String,
            require: true
        },
        numero_tarjeta: {
            type: Number,
            require: true,
            unique: true
        },
        fechaCaducidad_tarjeta: {
            type: Date,
            require: true
        },
        cvv: {
            type: Number,
            require: true
        }
    },
}, { collection: "usuarios" });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);