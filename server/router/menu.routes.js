const express = require("express");
const MenuController = require("../controllers/menu.controller.js");
const md_auth = require("../middlewares/authenticated.js");

const api = express.Router();

api.post("/menu", [md_auth], MenuController.createMenu);
api.get("/menu", MenuController.getMenus);
api.patch("/menu/:id", [md_auth], MenuController.updateMenu);
api.delete("/menu/:id", [md_auth], MenuController.deleteMenu);

module.exports = api;
