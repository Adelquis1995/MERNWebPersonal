const User = require("../models/user.model");
const bcrypt = require('bcryptjs')
const image = require("../utils/image");

async function getMe(req, res) {
    const { user_id } = req.user;

    const response = await User.findById(user_id).select("-password");

    if (!response) {
        return res.status(400).send({ msg: "Usuario no encontrado" });
    } else {
        return res.status(200).send({ response });
    }
}

async function getAllUsers(req, res) {
    const { active } = req.query;
    let response = null;
    if (active === undefined) {
        response = await User.find().select("-password");
    } else {
        response = await User.find({ active }).select("-password");
    }
    res.status(200).send({ response });
}

async function createUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        image.removeFile(req.file);
        return res.status(400).send({ msg: "El email y la contraseña son obligatorios" });
    }

    const user = new User({
        ...req.body,
        email: email.toLowerCase(),
        active: false,
    });

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    // multer deja el archivo en req.file cuando se usa upload.single("avatar")
    if (req.file) {
        user.avatar = image.getFilePath(req.file);
    }

    try {
        const userStored = await user.save();
        const { password: _, ...userData } = userStored.toObject();
        return res.status(200).send(userData);
    } catch (error) {
        // Si no se pudo guardar el usuario, el avatar subido queda huérfano
        image.removeFile(req.file);
        if (error.code === 11000) {
            return res.status(400).send({ msg: "El email ya está registrado" });
        }
        return res.status(400).send({ msg: "Error al registrar el usuario" });
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const userData = req.body;

    if (userData.password) {
        const salt = bcrypt.genSaltSync(10);
        userData.password = bcrypt.hashSync(userData.password, salt);
    } else {
        delete userData.password;
    }

    if (req.file) {
        userData.avatar = image.getFilePath(req.file);
    } else {
        delete userData.avatar;
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(id, userData);

        if (!userUpdated) {
            image.removeFile(req.file);
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }

        if (req.file && userUpdated.avatar) {
            image.removeStoredFile(userUpdated.avatar);
        }

        return res.status(200).send({ msg: "Usuario actualizado correctamente" });
    } catch (error) {
        image.removeFile(req.file);
        if (error.code === 11000) {
            return res.status(400).send({ msg: "El email ya está registrado" });
        }
        return res.status(400).send({ msg: "Error al actualizar el usuario" });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send({ msg: "Usuario no encontrado" })
        } else {
            image.removeStoredFile(deletedUser.avatar);
            return res.status(200).send({ msg: "Usuario eliminado correctamente" })
        }
    } catch (error) {
        return res.status(400).send({ msg: "Error al eliminar el usuario" })
    }

}

module.exports = {
    getMe,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}