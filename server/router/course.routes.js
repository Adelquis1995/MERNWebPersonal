const express = require('express');
const CourseController = require('../controllers/course.controller');
const md_auth = require('../middlewares/authenticated');
const createUploader = require('../middlewares/upload');

const md_upload_course = createUploader({
    field: 'miniature',
    folder: 'course',
    label: 'miniatura',
});

const api = express.Router();

api.post("/course", [md_auth, md_upload_course], CourseController.createCourse);
api.get("/course", CourseController.getCourses);
api.patch('/course/:id', [md_auth, md_upload_course], CourseController.updateCourse);
api.delete('/course/:id', [md_auth], CourseController.deleteCourse);
module.exports = api;