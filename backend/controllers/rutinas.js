const { response } = require('express');
const validator = require('validator');

const Rutina = require('../models/rutinas');
const Ejercicio = require('../models/ejercicios');
const Cliente = require('../models/cliente');
const Usuario = require('../models/usuarios');

/*
get / 
--> devuleve todas las rutinas
*/
const obtenerRutinas = async(req, res = response) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtenemos el ID de la rutina por si quiere buscar solo un rutina
    const id = req.query.id;
    const nombre = req.query.nombre;

    try {


        let rutinas, total;
        if (id) {

            [rutinas, total] = await Promise.all([
                Rutina.findById(id),
                Rutina.countDocuments()
            ]);
        } else if (nombre) {
            [rutinas, total] = await Promise.all([
                Rutina.findById(nombre),
                Rutina.countDocuments()
            ]);
        } else {
            [rutinas, total] = await Promise.all([
                Rutina.find({}).skip(desde).limit(registropp),
                Rutina.countDocuments()
            ]);
        }

        return res.status(200).json({
            ok: true,
            msg: 'obtenerRutinas',
            rutinas,
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
            msg: 'Error obteniendo rutinas'
        });
    }
}

const crearRutina = async(req, res = response) => {

    const object = req.body;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;


    try {

        const persona = await Usuario.findById(idToken);
        // Comprobar que no existe un rutina identico
        const existeRutinaNombre = await Rutina.findOne({ nombre: object.nombre });

        if (existeRutinaNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'Rutina ya existe con el mismo nombre'
            });
        }

        let ej;
        let obej = object.ejercicios;
        console.log("Los ejercicios", obej);
        //Comprobar que el id que se pasa sea el mismo id de un ejercicio
        for (var i = 0; i < obej.length; i++) {
            ej = await Ejercicio.findById(obej[i]);
            console.log("Entra bien", obej[i]);
            //Si sale null significa que no ha encontrado un id igual
            if (!ej) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los ejercicios introducidos no existen',
                    eje: obej
                });
            }
            ej = '';

        }

        //Comprobar que el los ejercicios no sean iguales
        var repetido = false;
        for (var i = 0; i < obej.length; i++) {
            for (var j = 0; j < obej.length; j++) {
                if (obej[i] == obej[j] && i != j) { //revisamos que i sea diferente de j, para que no compare el mismo elemento exacto.
                    repetido = true;
                }
            }
        }

        //Si es igual saca el error
        if (repetido == true) {
            return res.status(400).json({
                ok: false,
                msg: 'Ejercicios introducidos iguales',
                obej
            });
        }
        console.log("Object", object);
        const rutina = new Rutina(object);
        rutina.ejercicios = object.ejercicios;
        console.log("Rutina", rutina.ejercicios);

        if (rolToken != "ROL_ADMIN") {
            //Asignar fisio a la rutina y save            
            rutina.fisio_asignado.push(persona);
            await rutina.save();

            //Asignar rutina al fisio y save
            var Rutinita = persona.rutinas;
            Rutinita.push(rutina);
            persona.rutinas = Rutinita;
            await persona.save();
        } else {
            //Asignar rutina al fisio y save
            var Rutinita = persona.rutinas;
            Rutinita.push(rutina);
            persona.rutinas = Rutinita;
            //await persona.save();
            console.log("guardado");
            console.log(rutina);
            await rutina.save();
        }


        return res.status(201).json({
            ok: true,
            msg: 'Rutina creada',
            rutina,
            obej
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando rutina'
        });
    }
}

const actualizarRutina = async(req, res) => {


    const {...object } = req.body;
    const uid = req.params.id;
    const idToken = req.uidToken;


    try {

        const fisio = await Usuario.findById(idToken);
        const existeRutina = await Rutina.findOne({ nombre: object.nombre });

        if (existeRutina) {

            let ej;
            let obej = object.ejercicios;

            //Comprobar que el id que se pasa sea el mismo id de un ejercicio
            for (var i = 0; i < obej.length; i++) {
                ej = await Ejercicio.findById(obej[i]);
                //Si sale null significa que no ha encontrado un id igual
                if (!ej) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Los ejercicios introducidos no existen',
                        obej
                    });
                }
                ej = '';
            }

        } else {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo no existe'
            });
        }

        //Comprobar que el los ejercicios no sean iguales
        var repetido = false;
        for (var i = 0; i < obej.length; i++) {
            for (var j = 0; j < obej.length; j++) {
                if (obej[i] == obej[j] && i != j) { //revisamos que i sea diferente de j, para que no compare el mismo elemento exacto.
                    repetido = true;
                }
            }
        }

        //Si es igual saca el error
        if (repetido == true) {
            return res.status(400).json({
                ok: false,
                msg: 'Ejercicios introducidos iguales',
                obej
            });
        }


        const rutina = await Rutina.findByIdAndUpdate(uid, object, { new: true });

        //Modificamos las rutinas del fisio

        for (var i = 0; i < fisio.rutinas.length; i++) {
            if (fisio.rutinas[i]._id == uid) {
                fisio.rutinas[i] = rutina;
                await fisio.save();
            }
        }

        //Modificamos las rutinas del cliente

        const clientes = await Cliente.find();

        for (var i = 0; i < clientes.length; i++) {
            for (var j = 0; j < clientes[i].rutinas.length; j++) {
                if (clientes[i].rutinas[j]._id == uid) {
                    clientes[i].rutinas[j] = rutina;
                    await clientes[i].save();
                }
            }
        }

        return res.status(200).json({
            ok: true,
            msg: 'Rutina actualizada',
            rutina
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando rutina'
        });
    }
}

const eliminarRutina = async(req, res = response) => {

    const uid = req.params.id;
    const idToken = req.uidToken;

    try {
        // Comprobamos si existe la rutina que queremos eliminar
        const existeRutina = await Rutina.findById(uid);
        if (!existeRutina) {
            return res.status(404).json({ // No encontrado, not found
                ok: false,
                msg: 'La rutina no existe'
            });
        }

        // Lo eliminamos y devolvemos la rutina recien eliminado
        const resultado = await Rutina.findByIdAndRemove(uid);
        const fisio = await Usuario.findById(idToken);

        //Elminamos las rutinas del fisio

        for (var i = 0; i < fisio.rutinas.length; i++) {
            if (fisio.rutinas[i]._id == uid) {
                fisio.rutinas.splice(i, 1);
                await fisio.save();
            }
        }

        //Elminamos las rutinas del cliente

        const clientes = await Cliente.find();

        for (var i = 0; i < clientes.length; i++) {
            for (var j = 0; j < clientes[i].rutinas.length; j++) {
                if (clientes[i].rutinas[j]._id == uid) {
                    clientes[i].rutinas.splice(j, 1);
                    await clientes[i].save();
                }
            }
        }

        return res.status(200).json({
            ok: true,
            msg: 'Rutina eliminada',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error eliminando rutina'
        });

    }
}

const agregarRutinaCliente = async(req, res = response) => {

    const uid = req.params.id; //id de la rutina
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    //const object = req.body;
    const idfisio = req.query.idfisio;
    const idcliente = req.query.idcliente;
    let entro = 0;
    let reprutina = 0; // para comprobar si la rutina ya está en el array y no se repita


    try {
        const compruebafisio = await Usuario.findById(idfisio);
        const compruebacliente = await Cliente.findById(idcliente);
        const existerutina = await Rutina.findById(uid);
        const fisiotoken = await Usuario.findById(idToken);
        //Comprobamos si existe la rutina
        if (!existerutina) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe la rutina'
            });
        }

        //CUANDO EL TOKEN ES DE UN ADMIN
        if (rolToken == "ROL_ADMIN") {
            //ADMIN AGREGA RUTINA A FISIO
            if (compruebafisio && !compruebacliente) {
                entro = 1;
                //Mirar si ya existe esa rutina
                for (var i = 0; i < compruebafisio.rutinas.length; i++) {
                    if (compruebafisio.rutinas[i] == uid) {
                        reprutina = 1;
                    }
                }

                if (reprutina == 1) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe esa rutina'
                    });
                }
                compruebafisio.rutinas.push(uid);
            }
            //ADMIN AGREGA RUTINA A CLIENTE
            if (compruebafisio && compruebacliente) {
                entro = 2;
                //Comprobamos que el fisio este en los fisios del cliente
                let fisiocliente = 0;
                for (var i = 0; i < compruebacliente.listaFisios.length; i++) {
                    if (compruebacliente.listaFisios[i] == idfisio) {
                        //Mirar si ya existe esa rutina
                        for (var i = 0; i < compruebacliente.rutinas.length; i++) {
                            if (compruebacliente.rutinas[i] == uid) {
                                reprutina = 1;
                            }
                        }

                        if (reprutina == 1) {
                            return res.status(400).json({
                                ok: false,
                                msg: 'Ya existe esa rutina'
                            });
                        }
                        fisiocliente = 1;
                        compruebacliente.rutinas.push(uid);
                        await compruebacliente.save();
                    }
                }
                if (fisiocliente == 0) {
                    return res.status(403).json({ //Acceso prohibido
                        ok: false,
                        msg: 'Operación incorrecta' //Cliente no pertenece a ese fisio
                    });
                }

            }
        }
        //CUANDO EL TOKEN ES UN FISIO
        if (rolToken == "ROL_FISIO") {
            //FISIO AGREGA RUTINA A ÉL MISMO
            if (!idfisio && !idcliente) {
                entro = 3;
                //Mirar si ya existe esa rutina
                for (var i = 0; i < fisiotoken.rutinas.length; i++) {
                    if (fisiotoken.rutinas[i] == uid) {
                        reprutina = 1;
                    }
                }

                if (reprutina == 1) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe esa rutina'
                    });
                }
                fisiotoken.rutinas.push(uid);
            }
            //FISIO AGREGA RUTINA A CLIENTE
            if (!idfisio && idcliente) {
                entro = 4;
                //Comprobamos que el fisio este en los fisios del cliente
                let fisiocliente = 0;
                for (var i = 0; i < compruebacliente.listaFisios.length; i++) {
                    if (compruebacliente.listaFisios[i] == idToken) {
                        //Mirar si ya existe esa rutina
                        for (var i = 0; i < compruebacliente.rutinas.length; i++) {
                            if (compruebacliente.rutinas[i] == uid) {
                                reprutina = 1;
                            }
                        }

                        if (reprutina == 1) {
                            return res.status(400).json({
                                ok: false,
                                msg: 'Ya existe esa rutina'
                            });
                        }
                        fisiocliente = 1;
                        compruebacliente.rutinas.push(uid);
                        await compruebacliente.save();
                    }
                }
                if (fisiocliente == 0) {
                    return res.status(403).json({
                        ok: false,
                        msg: 'Operación incorrecta' //Cliente no pertenece a ese fisio
                    });
                }
            }
        }



        return res.status(200).json({
            ok: true,
            msg: 'Asignamiento realizado',
            entro
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error añadiendo rutina'
        });

    }
}

const quitarRutinaCliente = async(req, res = response) => { //Esta por hacer

    const uid = req.params.id; //id de la rutina
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    //const object = req.body;
    const idfisio = req.query.idfisio;
    const idcliente = req.query.idcliente;
    let entro = 0;


    try {
        const compruebafisio = await Usuario.findById(idfisio);
        const compruebacliente = await Cliente.findById(idcliente);
        const existerutina = await Rutina.findById(uid);
        const fisiotoken = await Usuario.findById(idToken);
        //Comprobamos si existe la rutina
        if (!existerutina) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe la rutina'
            });
        }

        //CUANDO EL TOKEN ES DE UN ADMIN
        if (rolToken == "ROL_ADMIN") {
            //ADMIN DELETEA RUTINA A FISIO
            if (compruebafisio && !compruebacliente) {
                entro = 1;
                for (var i = 0; i < compruebafisio.rutinas.length; i++) {
                    if (compruebafisio.rutinas[i]._id == uid) {
                        compruebafisio.rutinas.splice(i, 1);
                        await compruebafisio.save();
                    }
                }
            }
            //ADMIN DELETEA RUTINA A CLIENTE
            if (compruebafisio && compruebacliente) {
                entro = 2;
                //Comprobamos que el fisio este en los fisios del cliente
                let fisiocliente = 0;
                for (var i = 0; i < compruebacliente.listaFisios.length; i++) {
                    if (compruebacliente.listaFisios[i] == idfisio) {
                        fisiocliente = 1;
                    }
                }
                if (fisiocliente == 0) {
                    return res.status(403).json({ //Acceso prohibido
                        ok: false,
                        msg: 'Operación incorrecta' //Cliente no pertenece a ese fisio
                    });
                }
                for (var i = 0; i < compruebacliente.rutinas.length; i++) {
                    if (compruebacliente.rutinas[i]._id == uid) {
                        compruebacliente.rutinas.splice(i, 1);
                        await compruebacliente.save();
                    }
                }

            }
        }
        //CUANDO EL TOKEN ES UN FISIO
        if (rolToken == "ROL_FISIO") {
            //FISIO DELETEA RUTINA A ÉL MISMO
            if (!idfisio && !idcliente) {
                entro = 3;
                for (var i = 0; i < fisiotoken.rutinas.length; i++) {
                    if (fisiotoken.rutinas[i]._id == uid) {
                        fisiotoken.rutinas.splice(i, 1);
                        await fisiotoken.save();
                    }
                }
            }
            //FISIO DELETEA RUTINA A CLIENTE
            if (!idfisio && idcliente) {
                entro = 4;
                //Comprobamos que el fisio este en los fisios del cliente
                let fisiocliente = 0;
                for (var i = 0; i < compruebacliente.listaFisios.length; i++) {
                    if (compruebacliente.listaFisios[i] == idToken) {
                        fisiocliente = 1;
                    }
                }
                if (fisiocliente == 0) {
                    return res.status(403).json({
                        ok: false,
                        msg: 'Operación incorrecta' //Cliente no pertenece a ese fisio
                    });
                }
                for (var i = 0; i < compruebacliente.rutinas.length; i++) {
                    if (compruebacliente.rutinas[i]._id == uid) {
                        compruebacliente.rutinas.splice(i, 1);
                        await compruebacliente.save();
                    }
                }
            }
        }



        return res.status(200).json({
            ok: true,
            msg: 'Asignamiento realizado',
            entro
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error añadiendo rutina'
        });

    }

}



module.exports = { obtenerRutinas, crearRutina, actualizarRutina, eliminarRutina, agregarRutinaCliente, quitarRutinaCliente }