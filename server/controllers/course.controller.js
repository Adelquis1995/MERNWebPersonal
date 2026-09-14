const Course = require('../models/course.model');
const image = require("../utils/image");

async function createCourse(req, res) {
    const { title } = req.body;

    if (!title) {
        image.removeFile(req.file);
        return res.status(400).send({ msg: "El título del curso es obligatorio" });
    }

    const course = new Course({
        ...req.body,
    });

    // multer deja el archivo en req.file cuando se usa upload.single("miniature")
    if (req.file) {
        course.miniature = image.getFilePath(req.file);
    }

    try {
        const courseStored = await course.save();
        return res.status(200).send(courseStored);
    } catch (error) {
        // Si no se pudo guardar el curso, la miniatura subida queda huérfana
        image.removeFile(req.file);
        return res.status(400).send({ msg: "Error al crear el curso" });
    }
}

async function getCourses(req, res) {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const options = {
        page,
        limit,
        sort: { _id: -1 },
    };

    try {
        const courses = await Course.paginate({}, options);
        return res.status(200).send(courses);
    } catch (error) {
        return res.status(500).send({ msg: "Error al obtener los cursos" });
    }
}

async function updateCourse(req, res) {
    const { id } = req.params;
    const courseData = req.body ?? {};

    if (courseData.title !== undefined &&
        (typeof courseData.title !== "string" || !courseData.title.trim())) {
        image.removeFile(req.file);
        return res.status(400).send({ msg: "El título del curso no puede estar vacío" });
    }

    if (req.file) {
        courseData.miniature = image.getFilePath(req.file);
    } else {
        delete courseData.miniature;
    }

    try {
        const previousCourse = await Course.findByIdAndUpdate(id, courseData);

        if (!previousCourse) {
            image.removeFile(req.file);
            return res.status(404).send({ msg: "Curso no encontrado" });
        }

        if (req.file && previousCourse.miniature) {
            image.removeStoredFile(previousCourse.miniature);
        }

        return res.status(200).send({ msg: "Curso actualizado correctamente" });
    } catch (error) {
        image.removeFile(req.file);
        if (error.name === "CastError") {
            return res.status(400).send({ msg: "Id de curso inválido" });
        }
        return res.status(500).send({ msg: "Error al actualizar el curso" });
    }
}

async function deleteCourse(req, res) {
    const { id } = req.params

    try {
        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).send({ msg: "Curso no encontrado" })
        }
        image.removeStoredFile(deletedCourse.miniature);
        return res.status(200).send({ msg: "Curso eliminado correctamente" });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).send({ msg: "Id de Curso inválido" });
        }
        return res.status(400).send({ msg: "Error al eliminar el Curso" })
    }
}

module.exports = {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse
}