const { response } = require('express');
const validator = require('validator');

const Ejercicio = require('../models/ejercicios');
const Rutinas = require('../models/rutinas');

/*
get / 
--> devuleve todos los ejercicios
*/
const obtenerEjercicios = async(req, res = response) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtenemos el ID del ejercicio por si quiere buscar solo un ejercicio
    const id = req.query.id;

    const {...object } = req.body;

    try {


        let ejercicios, total;
        if (id) {

            [ejercicios, total] = await Promise.all([
                Ejercicio.findById(id),
                Ejercicio.countDocuments()
            ]);
        } else {
            [ejercicios, total] = await Promise.all([
                Ejercicio.find({}).skip(desde).limit(registropp),
                Ejercicio.countDocuments()
            ]);
        }

        return res.status(200).json({
            ok: true,
            msg: 'obtenerEjercicios',
            ejercicios,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniendo ejercicios'
        });
    }
}

const crearEjercicio = async(req, res = response) => {

    const {...object } = req.body;

    try {

        // Comprobar que no existe un ejercicio identico
        const existeEjercicioNombre = await Ejercicio.findOne({ nombre: object.nombre });
        const existeEjercicioTipo = await Ejercicio.findOne({ tipo: object.tipo });

        if (existeEjercicioNombre && existeEjercicioTipo) {
            return res.status(400).json({
                ok: false,
                msg: 'Ejercicio ya existe con el mismo nombre en el mismo tipo'
            });
        }

        if (existeEjercicioNombre && !existeEjercicioTipo) {
            return res.status(400).json({
                ok: false,
                msg: 'Ejercicio ya existe con el mismo nombre'
            });
        }


        const ejercicio = new Ejercicio(object);
        await ejercicio.save();

        return res.status(201).json({
            ok: true,
            msg: 'Ejercicio creado',
            ejercicio
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando ejercicio'
        });
    }
}

const actualizarEjercicio = async(req, res) => {


    const {...object } = req.body;
    const uid = req.params.id;


    try {

        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un usuaruio en BD con el email que nos llega en post
        const existeEjercicio = await Ejercicio.findOne({ nombre: object.nombre });

        if (existeEjercicio) {
            // Si existe un usuario con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (existeEjercicio._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ejercicio ya existe'
                });
            }
        }

        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.nombre = existeEjercicio.nombre;
        // al haber extraido password del req.body nunca se va a enviar en este put
        const ejercicio = await Ejercicio.findByIdAndUpdate(uid, object, { new: true });

        return res.status(200).json({
            ok: true,
            msg: 'Ejercicio actualizado',
            ejercicio
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando ejercicio'
        });
    }
}

const eliminarEjercicio = async(req, res = response) => {

    const uid = req.params.id;

    const {...object } = req.body;

    try {
        // Comprobamos si existe el ejercicio que queremos eliminar
        const existeEjercicio = await Ejercicio.findById(uid);
        if (!existeEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }
        // Lo eliminamos y devolvemos el ejercicio recien eliminado
        const resultado = await Ejercicio.findByIdAndRemove(uid);

        const rutinas = await Rutinas.find();


        //SE TIENE QUE ELIMINAR EL EJERCICIO EN LAS RUTINAS

        for (var i = 0; i < rutinas.length; i++) {
            for (var j = 0; j < rutinas[i].ejercicios.length; j++) {
                if (rutinas[i].ejercicios[j] == uid) {
                    rutinas[i].ejercicios.splice(j, 1);
                    await rutinas[i].save();
                }
            }
        }



        return res.status(200).json({
            ok: true,
            msg: 'Ejercicio eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error eliminando ejercicio'
        });

    }
}



module.exports = { obtenerEjercicios, crearEjercicio, actualizarEjercicio, eliminarEjercicio }