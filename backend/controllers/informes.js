const { response } = require('express');
const validator = require('validator');

const Informe = require('../models/informes');
const Usuario = require('../models/usuarios');
const Cliente = require('../models/cliente');

/*
get / 
--> devuelve todos los informes
*/
const obtenerInformes = async(req, res = response) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const fecha = req.query.fecha;
    const titulo = req.query.titulo;

    try {
        let informes, total;
        if (id) {
            [informes, total] = await Promise.all([
                Informe.findById(id),
                Informe.countDocuments()
            ]);
        } else if (fecha) {
            [informes, total] = await Promise.all([
                Informe.find(fecha),
                Informe.countDocuments()
            ]);
        } else if (titulo) {
            [informes, total] = await Promise.all([
                Informe.find(titulo),
                Informe.countDocuments()
            ]);
        } else {
            [informes, total] = await Promise.all([
                Informe.find({}).skip(desde).limit(registropp),
                Informe.countDocuments()
            ]);
        }

        return res.status(200).json({
            ok: true,
            msg: 'obtenerInformes',
            informes,
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
            msg: 'Error al obtener informes'
        });
    }
}

/*
post / 
<-- titulo y contenido necesarios
--> fisio asociado por token y fecha sistema
*/
const crearInforme = async(req, res = response) => {

    const object = req.body;
    const idToken = req.uidToken;
    object.fisio_asociado = idToken;

    const id = req.params.id;

    try {

        const fisio = await Usuario.findById(idToken);
        const existeCliente = await Cliente.findById(id);

        //Verificamos que exista el cliente
        if (!existeCliente) {
            return res.status(400).json({
                ok: false,
                msg: 'Cliente incorrecto'
            });
        }

        //Verificamos que el cliente sea del fisio
        let clientePropio;
        for (var i = 0; i < fisio.listaClientes.length; i++) {
            if (existeCliente.listaFisios[i] == id) {
                clientePropio = true;
                break;
            }
        }

        if (!clientePropio) {
            return res.status(400).json({
                ok: false,
                msg: 'Cliente incorrecto'
            });
        }
        //Creamos el informe
        const informe = new Informe(object);
        //Metemos el informe en los perfiles del fisio y el usuario
        let informesCliente = existeCliente.informes;
        informesCliente.push(informe);
        existeCliente.informes = informesCliente;

        // Almacenar en BD
        await informe.save();
        await existeCliente.save();

        return res.status(201).json({
            ok: true,
            msg: 'Informe creado',
            informe: informe,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando informe'
        });
    }
}



const eliminarInforme = async(req, res = response) => {

    const uid = req.params.id;
    const idToken = req.uidToken;


    try {
        // Comprobamos si existe el informe que queremos borrar
        const existeInforme = await Informe.findById(uid);
        if (!existeInforme) {
            return res.status(400).json({
                ok: true,
                msg: 'El informe no existe'
            });
        }

        const fisio = await Usuario.findById(idToken);
        const clientes = await Cliente.find();

        //Comprobamos que el fisio sea el autor del informe
        if (existeInforme.fisio_asociado != idToken) {
            return res.status(403).json({ //Acceso no autorizado
                ok: true,
                msg: 'No puedes tratar con un informe que no es tuyo'
            });
        }


        //Buscamos al cliente al que le haya hecho el informe para borrarlo de su lista
        for (var i = 0; i < clientes.length; i++) {
            for (var j = 0; j < clientes[i].informes.length; j++) {
                if (clientes[i].informes[j] == uid) {
                    clientes[i].informe.splice(j, 1);
                    await clientes[i].save();
                }
            }
        }

        const resultado = await Informe.findByIdAndRemove(uid);

        return res.status(200).json({
            ok: true,
            msg: 'Informe eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Error borrando informe'
        });
    }
}

module.exports = { obtenerInformes, crearInforme, eliminarInforme }