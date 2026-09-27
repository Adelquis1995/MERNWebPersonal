const express = require('express');
const postController = require('../controllers/post.controller');
const md_auth = require('../middlewares/authenticated');
const createUploader = require('../middlewares/upload');

const md_upload_blog = createUploader({ field: 'blog' });

const api = express.Router();

module.exports = api;