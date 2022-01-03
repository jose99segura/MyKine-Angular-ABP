const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { infoToken } = require('../helpers/infotoken');

const Usuario = require('../models/usuarios');
const Cliente = require('../models/cliente');
/*
get / 
<-- desde? el salto para buscar en la lista de usuarios
    id? un identificador concreto, solo busca a este
--> devuleve todos los usuarios
*/

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const listaUsuarios = async(req, res) => {
    const lista = req.body.lista;

    if (!lista) {
        res.status(400).json({
            ok: true,
            msg: 'listaUsuarios',
            usuarios: 'none',
        });
    }

    // Solo puede listar usuarios un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(403).json({ //Acceso no autorizado
            ok: false,
            msg: 'No tiene permisos para listar usuarios',
        });
    }

    try {
        const usuarios = await Usuario.find({ _id: { $in: lista }, activo: true }).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 });
        res.status(200).json({
            ok: true,
            msg: 'Lista de usuarios obtenido',
            usuarios
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al listar usuarios por uids',
        });
    }

}

const listaUsuariosRol = async(req, res) => {
    const rol = req.params.rol;
    const lista = req.body.lista;

    // Solo puede listar usuarios un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(403).json({ //Acceso no autorizado
            ok: false,
            msg: 'No tiene permisos para listar usuarios',
        });
    }

    listaB = [];
    if (!lista) { listaB = []; }

    try {
        const usuarios = await Usuario.find({ _id: { $nin: lista }, rol: rol, activo: true }).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 });
        res.status(200).json({
            ok: true,
            msg: 'Lista de usuarios obtenida',
            usuarios
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al listar usuarios por rol',
            error
        });
    }

}

//ESTE ES EL METODO DE JAVI Y EDU, EL ERROR ESTA AQUI, PORQUE USANDO EL JOSE VICENTE SI QUE LISTA LOS USUARIOS

// const obtenerUsuarios = async(req, res) => {

//     // Para paginación
//     // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
//     const desde = Number(req.query.desde) || 0;
//     const registropp = Number(process.env.DOCSPERPAGE);
//     const texto = req.query.texto;
//     let textoBusqueda = "";
//     if (texto) {
//         textoBusqueda = new RegExp(texto, "i");
//         //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
//     }

//     // Obtenemos el ID de usuario por si quiere buscar solo un usuario
//     const id = req.query.id;

//     const {...object } = req.body;

//     const rolToken = req.rolToken;
//     const idToken = req.uidToken;



//     try {

//         // Solo puede listar usuarios un admin
//         const token = req.header('x-token');
//         if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'No tiene permisos para listar usuarios',
//             });
//         }

//         let usuarios, total;
//         // Si ha llegado ID, hacemos el get /id
//         if (id) {

//             [usuarios, total] = await Promise.all([
//                 Usuario.findById(id),
//                 Usuario.countDocuments()
//             ]);

//         } else if (idToken) {
//             [usuarios, total] = await Promise.all([
//                 Usuario.findById(idToken),
//                 Usuario.countDocuments()
//             ]);
//         }
//         // Si no ha llegado ID, hacemos el get / paginado
//         else {
//             [usuarios, total] = await Promise.all([
//                 Usuario.find({}).skip(desde).limit(registropp),
//                 Usuario.countDocuments()
//             ]);
//         }

//         res.json({
//             ok: true,
//             msg: 'obtenerUsuarios',
//             usuarios,
//             page: {
//                 desde,
//                 registropp,
//                 total,
//                 rolToken,
//                 idToken
//             }
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             ok: false,
//             msg: 'Error obteniedo usuarios'
//         });
//     }
// }

//METODO DE JOSE VICENTE
const obtenerUsuarios = async(req, res) => {
    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || "";

    //await sleep(1000);
    try {
        // Solo puede listar usuarios un admin
        const token = req.header("x-token");
        if (!(infoToken(token).rol === "ROL_ADMIN" || infoToken(token).uid === id)) {
            return res.status(400).json({
                ok: false,
                msg: "No tiene permisos para listar usuarios",
            });
        }

        let usuarios, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {
            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments(),
            ]);
        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            let query = {};
            if (texto) {
                query = {
                    $or: [
                        { nombre: textoBusqueda },
                        { apellidos: textoBusqueda },
                        { email: textoBusqueda },
                    ],
                };
            }

            [usuarios, total] = await Promise.all([
                Usuario.find(query)
                .skip(desde)
                .limit(registropp)
                .collation({ locale: "es" })
                .sort({ apellidos: 1, nombre: 1 }),
                Usuario.countDocuments(query),
            ]);
        }

        res.status(200).json({
            ok: true,
            msg: "Usuarios obtenidos",
            usuarios,
            page: {
                desde,
                registropp,
                total,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error obteniendo usuarios",
        });
    }
};


/*
post / 
<-- nombre, apellidos, email, password, rol?
--> usuario registrado
*/
const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;
    // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
    const { alta, ...object } = req.body;
    const planMensual = object.planMensual;


    const rolToken = req.rolToken;
    const idToken = req.uidToken;

    try {

        // Comprobar que no existe un usuario con ese email registrado
        const exiteEmail = await Usuario.findOne({ email: email });

        //Ya hemos validado en el routes que solo sea un admin el que pueda hacer esta operación

        //Vemos si existe el email y si es usuario y lo quiere registrar un fisio
        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya en uso'
            });
        }


        // Cifrar la contraseña, obtenemos el salt y ciframos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        const usuario = new Usuario(object);
        usuario.password = cpassword;
        usuario.rol = "ROL_FISIO";
        if (object.rol) {
            usuario.rol = object.rol;
        }

        //COMPROBAMOS EL PLAN MENSUAL, SINO HAY -> PLAN GRATIS
        if (!planMensual) {
            usuario.planMensual = "Gratis";
        } else if (planMensual != "Gratis" && planMensual != "Estandar" && planMensual != "Premium") {
            return res.status(400).json({
                ok: false,
                msg: 'Plan mensual incorrecto'
            });
        }


        // Almacenar en BD
        await usuario.save();



        res.status(201).json({
            ok: true,
            msg: 'Usuario creado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}



const actualizarPassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        if (infoToken(token).uid === uid) {

            if (nuevopassword !== nuevopassword2) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña repetida no coincide con la nueva contraseña',
                });
            }

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });
            }
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        usuarioBD.password = cpassword;

        // Almacenar en BD
        await usuarioBD.save();

        res.status(200).json({
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



/*
post /:id
<-- nombre, apellidos, email, rol   
--> usuario actualizado
*/

const actualizarUsuario = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { password, alta, email, ...object } = req.body;
    const uid = req.params.id;


    try {

        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un usuaruio en BD con el email que nos llega en post
        const existeEmail = await Usuario.findOne({ email: email });
        const idToken = req.uidToken;
        const token = req.header("x-token");

        //comprobamos que el usuario que se quiere actualizar es él mismo

        // COMENTADO
        // if (uid != idToken) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'No puedes actualizar otros usuarios'
        //     });
        // }


        if (!(infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).uid === uid)) {
            return res.status(403).json({ //Acceso no autorizado
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }

        if (existeEmail) {
            // Si existe un usuario con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;
        // al haber extraido password del req.body nunca se va a enviar en este put
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

/*
delete /:id
--> OK si ha podido borrar
*/
const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;
    const rolToken = req.rolToken;
    const idToken = req.uidToken;

    try {
        // Comprobamos si existe el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }

        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        let resultado = '';

        if (!existeUsuario.rol == "ROL_FISIO") {
            return res.status(404).json({ //Not found
                ok: true,
                msg: 'El usuario no existe'
            });
        }



        if (rolToken == "ROL_ADMIN") {
            resultado = await Usuario.findByIdAndRemove(uid);
            //Ahora comprobaremos los clientes con los que estaba asociados para borrarle de sus listas
            const clientes = await Cliente.find();
            for (var i = 0; i < clientes.length; i++) {
                for (var j = 0; j < clientes[i].listaFisios.length; j++) {
                    if (clientes[i].listaFisios[j] == uid) {
                        clientes[i].listaFisios.splice(j, 1);
                        await clientes[i].save();
                    }
                }
            }
        }

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Error borrando usuario'
        });
    }
}


module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, actualizarPassword, listaUsuarios, listaUsuariosRol }