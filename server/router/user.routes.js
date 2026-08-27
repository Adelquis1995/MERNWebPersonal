const express = require('express');
const userController = require('../controllers/user.controller');
const md_auth = require('../middlewares/authenticated');
const md_upload_avatar = require('../middlewares/upload');

const api = express.Router();

api.get('/user/me', [md_auth], userController.getMe);
api.get('/users', [md_auth], userController.getAllUsers);
api.post('/user', [md_auth, md_upload_avatar], userController.createUser);
api.patch('/user/:id', [md_auth, md_upload_avatar], userController.updateUser);

module.exports = api;