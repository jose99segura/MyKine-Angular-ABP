const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { infoToken } = require('../helpers/infotoken');

const Usuario = require('../models/usuarios');
const Informe = require('../models/informes');
const Cliente = require('../models/cliente');
const { compruebaPlanes } = require('../helpers/compruebaPlanes');
const { generatePasswordRand } = require('../helpers/generadorPass');
/*
get / 
<-- desde? el salto para buscar en la coleccion clientes
    id? un identificador concreto, solo busca a este
--> sino devuelve todos los usuarios
*/
const obtenerClientes = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id;

    const {...object } = req.body;
    //recogemos el rol y el id presentes en el token del header
    const rolToken = req.rolToken;
    const idToken = req.uidToken;



    try {

        let clientes, total, fisios;
        //Si es admin puede ver toda la lista
        if (rolToken == "ROL_ADMIN") {
            // Si ha llegado ID, hacemos el get /id
            if (id) {

                [clientes, total] = await Promise.all([
                    Cliente.findById(id).skip(desde).limit(registropp),
                    Cliente.countDocuments()
                ]);

            }
            //Puede buscar por nombre tambien
            /*else if () {

            }*/
            // Si no ha llegado ID, hacemos el get / paginado
            else {
                [clientes, total, fisios] = await Promise.all([
                    Cliente.find({}).skip(desde).limit(registropp),
                    Cliente.countDocuments(),
                    Cliente.find({}).skip(desde).limit(registropp).populate('listaFisios')
                ]);
            }
        } else if (rolToken == "ROL_FISIO") { //Si es fisio solo puede ver sus asociados
            //Puede buscar por nombre de cliente tambien

            /*let query = {};
            if (texto) {
                query = { $and: [{ cliente: textoBusqueda }, { fisio: idToken }] };
            }

            [usuarios, total] = await Promise.all([
                Usuario.find(query).skip(desde).limit(registropp),
                Usuario.countDocuments(query)
            ]);*/ //Busqueda por querys para mas adelante

            [clientes, total] = await Promise.all([
                Cliente.findById(idToken),
                Cliente.countDocuments()
            ]);
        }


        return res.status(200).json({
            ok: true,
            msg: 'obtenerUsuarios',
            clientes,
            page: {
                desde,
                registropp,
                total,
                rolToken,
                idToken,
                fisios
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error obteniedo clientes'
        });
    }
}

/*
post / 
<-- nombre, apellidos, email, password, rol?
--> cliente registrado
*/
const crearCliente = async(req, res = response) => {

    const { email, nombre_apellidos } = req.body;
    // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
    const { alta, ...object } = req.body;
    //recogemos el rol y el id presentes en el token del header
    const rolToken = req.rolToken;
    const idToken = req.uidToken;
    const id = req.query.id;
    let fisiorepe = 0;

    try {

        // Comprobar que no existe un cliente con ese email registrado
        const exiteEmail = await Cliente.findOne({ email: email });
        const fisio = await Usuario.findById(idToken);
        let cliente;

        if (exiteEmail) {
            //Comprobamos que el nombre no sea diferente al usuario registrado con ese email
            //asegurandonos asi que se trata de la misma persona
            if (exiteEmail.nombre_apellidos != nombre_apellidos) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existente para otro usuario',
                });
            }
            //Comprobamos si viene el id de un fisio, por si lo registra un admin
            if (rolToken == "ROL_ADMIN") {
                if (id) {
                    let compruebafisio = await Usuario.findById(id);
                    if (!compruebafisio || compruebafisio.rol != "ROL_FISIO") {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Fisio incorrecto',
                        });
                    }
                    //COMPROBAMOS QUE EL FISIO NO EXISTA YA EN EL ARRAY DEL CLIENTE
                    for (var i = 0; i < exiteEmail.listaFisios.length; i++) {
                        if (exiteEmail.listaFisios[i] == id) {
                            fisiorepe = 1;
                        }
                    }
                    if (fisiorepe == 1) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Fisio repetido',
                        });
                    }


                    exiteEmail.listaFisios.push(id);
                    //Incrementamos el numero de clientes del fisio
                    compruebafisio.num_clientes = compruebafisio.num_clientes + 1;
                    //COMPROBAMOS CON EL HELPER QUE NO EXCEDA DE SU LIMITE DE CLIENTES
                    if (compruebafisio.num_clientes > compruebaPlanes(compruebafisio)) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Limite alcanzado',
                        });
                    }
                    console.log("Plan:__", compruebaPlanes(compruebafisio));
                    await exiteEmail.save();
                    await compruebafisio.save();
                } else {
                    return res.status(400).json({ //Falta el ID del fisio
                        ok: false,
                        msg: 'Faltan parámetros',
                    });
                }
            } else {
                //COMPROBAMOS QUE EL FISIO NO EXISTA YA EN EL ARRAY DEL CLIENTE
                for (var i = 0; i < exiteEmail.listaFisios.length; i++) {
                    if (exiteEmail.listaFisios[i] == idToken) {
                        fisiorepe = 1;
                    }
                }
                if (fisiorepe == 1) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Fisio repetido',
                    });
                }

                exiteEmail.listaFisios.push(idToken);
                //Incrementamos el numero de clientes del fisio
                fisio.num_clientes = fisio.num_clientes + 1;
                //COMPROBAMOS CON EL HELPER QUE NO EXCEDA DE SU LIMITE DE CLIENTES
                if (fisio.num_clientes > compruebaPlanes(fisio)) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Limite alcanzado',
                    });
                }
                console.log("Plan:__", compruebaPlanes(fisio));
                await exiteEmail.save();
                await fisio.save();
            }

        } else {
            // Cifrar la contraseña, obtenemos el salt y ciframos
            const salt = bcrypt.genSaltSync();
            const cpassword = bcrypt.hashSync(generatePasswordRand(4), salt);

            cliente = new Cliente(object);
            cliente.password = cpassword;
            if (rolToken == "ROL_ADMIN") {
                if (id) {
                    let compruebafisio = await Usuario.findById(id);
                    if (!compruebafisio || compruebafisio.rol != "ROL_FISIO") {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Fisio incorrecto',
                        });
                    }
                    //COMPROBAMOS QUE EL FISIO NO EXISTA YA EN EL ARRAY DEL CLIENTE
                    for (var i = 0; i < cliente.listaFisios.length; i++) {
                        if (cliente.listaFisios[i] == id) {
                            fisiorepe = 1;
                        }
                    }
                    if (fisiorepe == 1) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Fisio repetido',
                        });
                    }
                    cliente.listaFisios.push(id);
                    //Incrementamos el numero de clientes del fisio
                    compruebafisio.num_clientes = compruebafisio.num_clientes + 1;
                    //COMPROBAMOS CON EL HELPER QUE NO EXCEDA DE SU LIMITE DE CLIENTES
                    if (compruebafisio.num_clientes > compruebaPlanes(compruebafisio)) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Limite alcanzado',
                        });
                    }
                    console.log("Plan:__", compruebaPlanes(compruebafisio));
                    await cliente.save();
                    await compruebafisio.save();
                }
            } else {
                if (id) {
                    return res.status(403).json({ //Acceso prohibido
                        ok: false,
                        msg: 'Operación no autorizada',
                    });
                }
                //COMPROBAMOS QUE EL FISIO NO EXISTA YA EN EL ARRAY DEL CLIENTE
                for (var i = 0; i < cliente.listaFisios.length; i++) {
                    if (cliente.listaFisios[i] == id) {
                        fisiorepe = 1;
                    }
                }
                if (fisiorepe == 1) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Fisio repetido',
                    });
                }
                cliente.listaFisios.push(idToken);
                //Incrementamos el numero de clientes del fisio
                fisio.num_clientes = fisio.num_clientes + 1;
                //COMPROBAMOS CON EL HELPER QUE NO EXCEDA DE SU LIMITE DE CLIENTES
                if (fisio.num_clientes > compruebaPlanes(fisio)) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Limite alcanzado',
                    });
                }
                console.log("Plan:__", compruebaPlanes(fisio));
                await cliente.save();
                await fisio.save();
            }

        }
        return res.status(201).json({ //Cliente creado
            ok: true,
            msg: 'Cliente registrado',
            cliente: cliente
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}

const cambiarPassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const clienteBD = await Cliente.findById(uid);
        if (!clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }
        //COMENTAMOS ESTO DE MOMENTO
        //const validPassword = bcrypt.compareSync(password, clienteBD.password);

        // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        if (infoToken(token).uid === uid) {

            if (nuevopassword !== nuevopassword2) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña repetida no coincide con la nueva contraseña',
                });
            }
            //COMENTAMOS ESTO DE MOMENTO 

            /*if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });

            }*/
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        clienteBD.password = cpassword;

        // Almacenar en BD
        await clienteBD.save();

        return res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }


}

const borrarCliente = async(req, res = response) => {

    const uid = req.params.id;
    let resultado; //Variable que mostrará el resultado en el JSON
    const idfisio = req.query.idfisio;

    try {
        //Recogemos el rol y el id presentes en el token del header
        const rolToken = req.rolToken;
        const idToken = req.uidToken;

        const fisio = await Usuario.findById(idToken);
        const cliente = await Cliente.findById(uid);
        //Comprobamos que el cliente exista
        if (!cliente) {
            return res.status(400).json({
                ok: false,
                msg: 'El cliente no existe'
            });
        }
        if (rolToken == "ROL_FISIO") {
            //Miramos que el id del fisio coincida con los que tiene el cliente en su coleccion de fisios
            //y si coincide lo borramos. Si el tamaño del array de fisios del cliente se queda a 0,
            //significa que no tenia mas fisios asociados, por lo que habrá que borrarlo
            if (id) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Operación no autorizada',
                });
            }
            for (var i = 0; i < cliente.listaFisios.length; i++) {
                if (cliente.listaFisios[i] == idToken) {
                    cliente.listaFisios.splice(i, 1);
                    await cliente.save();
                    resultado = "El fisio" + fisio.nombre_apellidos + "fue borrado de la lista del cliente" + cliente.nombre_apellidos;
                    //Decrementamos el numero de clientes del fisio
                    fisio.num_clientes = fisio.num_clientes - 1;
                    await fisio.save();
                }
            }
        } else {
            if (!idfisio) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Acción no autorizada'
                });
            }
            let compruebafisio = await Usuario.findById(idfisio);
            if (!compruebafisio || compruebafisio.rol != "ROL_FISIO") {
                return res.status(400).json({
                    ok: false,
                    msg: 'Fisio incorrecto',
                });
            }
            for (var i = 0; i < cliente.listaFisios.length; i++) {
                if (cliente.listaFisios[i] == idfisio) {
                    cliente.listaFisios.splice(i, 1);
                    await cliente.save();
                    resultado = "El fisio" + fisio.nombre_apellidos + "fue borrado de la lista del cliente" + cliente.nombre_apellidos;
                    //Decrementamos el numero de clientes del fisio
                    fisio.num_clientes = fisio.num_clientes - 1;
                    await fisio.save();
                }
            }


        }


        if (cliente.listaFisios.length == 0) {
            // Lo eliminamos y devolvemos el usuaurio recien eliminado
            resultado = await Cliente.findByIdAndRemove(uid);
        }
        let tamarray = cliente.listaFisios.length;

        return res.status(200).json({
            ok: true,
            resultado: resultado,
            uid,
            idfisio,
            tamarray
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Error borrando cliente'
        });
    }
}





module.exports = { obtenerClientes, crearCliente, cambiarPassword, borrarCliente }