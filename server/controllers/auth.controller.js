const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwt = require('../utils/jwt');

async function register(req, res) {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname) return res.status(400).send({ msg: "El nombre es obligatorio" });
    if (!lastname) return res.status(400).send({ msg: "El apellido es obligatorio" });
    if (!email) return res.status(400).send({ msg: "El email es obligatorio" });
    if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

    const user = new User({
        firstName: firstname,
        lastName: lastname,
        email: email.toLowerCase(),
        role: 'user',
        active: true,
    });

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    try {
        await user.save();
        return res.status(200).send({ msg: "Usuario registrado con éxito" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ msg: "El email ya está registrado" });
        }
        return res.status(400).send({ msg: "Error al registrar el usuario" });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ msg: "El email es obligatorio" });
    if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

    try {
        const userStore = await User.findOne({ email: email.toLowerCase() });

        if (!userStore) {
            return res.status(400).send({ msg: "Credenciales inválidas" });
        }

        const check = await bcrypt.compare(password, userStore.password);
        if (!check) {
            return res.status(400).send({ msg: "Credenciales inválidas" });
        }

        if (!userStore.active) {
            return res.status(400).send({ msg: "El usuario no está activo" });
        }

        return res.status(200).send({
            access: jwt.createAccessToken(userStore),
            refresh: jwt.createRefreshToken(userStore)
        });
    } catch (error) {
        return res.status(500).send({ msg: "Error del servidor" });
    }
}

async function refreshAccessToken(req, res) {
    const { token } = req.body;

    if (!token) return res.status(400).send({ msg: "Token requerido" });

    let payload;
    try {
        payload = jwt.verifyToken(token);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).send({ msg: "El refresh token ha expirado" });
        }
        return res.status(400).send({ msg: "Token inválido" });
    }

    // Solo un refresh token puede pedir un nuevo access token
    if (payload.token_type !== "refresh") {
        return res.status(400).send({ msg: "Token inválido" });
    }

    try {
        const userStore = await User.findById(payload.user_id);

        if (!userStore) {
            return res.status(400).send({ msg: "Usuario no encontrado" });
        }

        return res.status(200).send({ access: jwt.createAccessToken(userStore) });
    } catch (error) {
        return res.status(500).send({ msg: "Error del servidor" });
    }
}

module.exports = {
    register,
    login,
    refreshAccessToken
};
