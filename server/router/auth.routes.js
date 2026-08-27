const express = require('express');
const jwt = require('../utils/jwt');
const AuthController = require('../controllers/auth.controller.js');

const api = express.Router();

api.post('/auth/register', AuthController.register);
api.post('/auth/login', AuthController.login);
api.post('/auth/refresh_access_token', AuthController.refreshAccessToken);

module.exports = api;