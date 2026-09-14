const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Crea un middleware de subida para un campo concreto:
//   field:  nombre del campo del formulario (multipart) -> req.file
//   folder: subcarpeta dentro de /uploads (por defecto, el propio campo)
//   label:  cómo se nombra el archivo en los mensajes de error
function createUploader({ field, folder = field, label = field }) {
    const destination = path.join(UPLOADS_DIR, folder);

    // La carpeta destino debe existir antes de que multer intente escribir
    fs.mkdirSync(destination, { recursive: true });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname).toLowerCase();
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
            cb(null, uniqueName);
        },
    });

    function fileFilter(req, file, cb) {
        if (!MIME_TYPES.includes(file.mimetype)) {
            return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", field));
        }
        cb(null, true);
    }

    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: MAX_SIZE, files: 1 },
    });

    // Envolvemos multer para devolver un JSON de error en vez de dejar
    // que el error llegue al manejador por defecto de express
    return function uploadFile(req, res, next) {
        upload.single(field)(req, res, (error) => {
            if (error instanceof multer.MulterError) {
                if (error.code === "LIMIT_FILE_SIZE") {
                    return res
                        .status(400)
                        .send({ msg: `El ${label} no puede superar los 5 MB` });
                }
                return res
                    .status(400)
                    .send({ msg: `El ${label} debe ser una imagen (jpg, png, webp o gif)` });
            }
            if (error) {
                return res.status(500).send({ msg: `Error al subir el ${label}` });
            }
            next();
        });
    };
}

module.exports = createUploader;
