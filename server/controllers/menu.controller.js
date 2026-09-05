const Menu = require('../models/menu.model.js');

async function createMenu(req, res) {
    const menu = new Menu(req.body);

    try {
        const menuStored = await menu.save();
        return res.status(201).send({ menuStored });
    } catch (error) {
        return res.status(400).send({ msg: "Error al crear el menu" });
    }
}

async function getMenus(req, res) {
    const { active } = req.query;
    const filter = active === undefined ? {} : { active };

    try {
        const response = await Menu.find(filter).sort({ order: "asc" });

        if (response.length === 0) {
            return res.status(404).send({ msg: "No se encontraron menus" });
        }
        return res.status(200).send({ response });
    } catch (error) {
        return res.status(400).send({ msg: "Error al obtener los menus" });
    }
}

async function updateMenu(req, res) {
    const { id } = req.params;
    const update = req.body;

    try {
        const menuUpdated = await Menu.findByIdAndUpdate(id, update, { new: true });

        if (!menuUpdated) {
            return res.status(404).send({ msg: "No se encontró el menu" });
        }

        return res.status(200).send({ menuUpdated });
    } catch (error) {
        return res.status(400).send({ msg: "Error al actualizar el menu" });
    }
}

async function deleteMenu(req, res) {
    try {
        const { id } = req.params
        const deletedMenu = await Menu.findByIdAndDelete(id);
        if (!deletedMenu) {
            return res.status(404).send({ msg: "Menu no encontrado" })
        } else {
            return res.status(200).send({ msg: "Menu eliminado correctamente" })
        }
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).send({ msg: "Id de menu inválido" });
        }
        return res.status(400).send({ msg: "Error al eliminar el Menu" })
    }

}

module.exports = {
    createMenu,
    getMenus,
    updateMenu,
    deleteMenu
}