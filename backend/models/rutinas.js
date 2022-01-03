const { Schema, model } = require('mongoose');

const ItemSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    descripcion: {
        type: String,
        require: true
    },
    imagen: {
        type: String, //File??
        require: true
    },
    ejercicios: [{
        type: Schema.Types.ObjectId,
        ref: 'Ejercicio'
    }],
    fisio_asignado: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }]

}, { collection: 'rutinas' });

ItemSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Rutina', ItemSchema);