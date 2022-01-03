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
    tipo: {
        type: String,
        require: true
    }
}, { collection: 'ejercicios' });

ItemSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Ejercicio', ItemSchema);