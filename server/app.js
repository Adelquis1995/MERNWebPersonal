const express = require("express");
const bodyParser = require("body-parser");
const { API_VERSION } = require("./config");
const cors = require("cors");

const app = express();

//Import routes
const authRoutes = require("./router/auth.routes.js");
const userRoutes = require("./router/user.routes.js")
const menuRoutes = require("./router/menu.routes.js")

//Configure Body Parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Configure static folder
app.use(express.static("uploads"));

//Configure Header HTTP - CORS
app.use(cors());

//Configure routings
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
module.exports = app;