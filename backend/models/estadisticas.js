const { Schema, model } = require('mongoose');

const ItemSchema = Schema({
    num_total_personas: {
        type: Number,
        default: '0'
    },
    num_usuarios: {
        type: Number,
        default: '0'
    },
    num_fisios: {
        type: Number,
        default: '0'
    },
    plan_mensual_gratis: {
        type: Number,
        default: '0'
    },
    plan_mensual_estandar: {
        type: Number,
        default: '0'
    },
    plan_mensual_premium: {
        type: Number,
        default: '0'
    },
    num_visitas: {
        type: Number,
        default: '0'
    }
}, { collection: 'estadisticas' });

ItemSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Estadisticas', ItemSchema);