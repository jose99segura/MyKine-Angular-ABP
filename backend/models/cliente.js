const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    //Campos comunes
    nombre_apellidos: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true //-----lo quitamos para que se pueda registrar sin pass
    },
    imagen: {
        type: String // file??
    },
    alta: {
        type: Date,
        default: Date.now
    },
    listaFisios: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    rutinas: [{
        type: Schema.Types.ObjectId,
        ref: 'Rutina'
    }],
    informes: [{
        type: Schema.Types.ObjectId,
        ref: 'Informe'
    }],
    estadisticas: {
        type: String
    }

}, { collection: 'clientes' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Cliente', UsuarioSchema);