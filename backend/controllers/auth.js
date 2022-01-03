const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const Cliente = require('../models/cliente');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require("../helpers/google-verify");
const jwt = require('jsonwebtoken');

const token = async(req, res = response) => {
    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }
        const rolBD = usuarioBD.rol;

        const nuevoToken = await generarJWT(uid, rol);

        res.status(200).json({
            ok: true,
            msg: 'Token',
            uid: uid,
            nombre: usuarioBD.nombre,
            apellidos: usuarioBD.apellidos,
            email: usuarioBD.email,
            rol: rolBD,
            alta: usuarioBD.alta,
            activo: usuarioBD.activo,
            imagen: usuarioBD.imagen,
            token: nuevoToken
        });
    } catch {
        return res.status(500).json({
            ok: false,
            msg: 'Token no válido',

            token: ''
        });
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;
    let _idres, rolres, tokenres; //Variables auxiliares para evitarnos problemas en la respuesta JSON

    try {
        //COMPROBAMOS SI ES UN ADMIN, FISIO O CLIENTE
        const usuarioBD = await Usuario.findOne({ email });
        const clienteBD = await Cliente.findOne({ email });
        if (!usuarioBD && !clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        //LOGIN PARA ADMIN Y FISIO
        if (usuarioBD) {
            const validPassword = bcrypt.compareSync(password, usuarioBD.password);
            const password2 = usuarioBD.password;
            //const passwordBD = await Usuario.findOne({ password });
            if (!validPassword /*!passwordBD*/ ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario o contraseñaa incorrectos',
                    token: '',
                    password,
                    password2
                });
            }

            const { _id, rol } = usuarioBD;
            const token = await generarJWT(usuarioBD._id, usuarioBD.rol);
            //Para que no haya problemas con la respuesta JSON
            _idres = _id;
            rolres = rol;
            tokenres = token;
        }

        //LOGIN PARA CLIENTE
        if (clienteBD) {
            const validPassword = bcrypt.compareSync(password, clienteBD.password);
            const password2 = clienteBD.password;
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Cliente o contraseñaa incorrectos',
                    token: '',
                    password,
                    password2
                });
            }

            const { _id, rol } = clienteBD;
            const token = await generarJWT(clienteBD._id, clienteBD.rol);
            //Para que no haya problemas con la respuesta JSON
            _idres = _id;
            rolres = rol;
            tokenres = token;
        }

        let _id = _idres;
        let rol = rolres;
        let token = tokenres;

        res.status(201).json({ //Token creado
            ok: true,
            msg: 'login',
            _id,
            rol,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }

}


const logingoogle = async(req, res = response) => {
    // const { email, password } = req.body;
    // let _idres, rolres, tokenres; //Variables auxiliares para evitarnos problemas en la respuesta JSON

    const tokenGoogle = req.body.token;

    try {
        const { email, ...payload } = await googleVerify(tokenGoogle);
        console.log(payload);
        console.log(email);

        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: "Identificación con Google incorrecta",
                token: "",
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        res.json({
            ok: true,
            msg: "login google",
            uid: _id,
            rol,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en login",
            token: "",
        });
    }
};

module.exports = { login, token, logingoogle };