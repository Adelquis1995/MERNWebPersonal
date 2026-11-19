const express = require('express');
const postController = require('../controllers/post.controller');
const md_auth = require('../middlewares/authenticated');
const createUploader = require('../middlewares/upload');

const md_upload_blog = createUploader({
    field: 'miniature',
    folder: 'blog',
    label: 'miniatura',
});

const api = express.Router();

api.post("/post", [md_auth, md_upload_blog], postController.createPost);
api.get("/post", postController.getPosts);


module.exports = api;