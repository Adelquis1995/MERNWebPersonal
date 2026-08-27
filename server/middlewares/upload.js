const fs = require("fs");
const path = require("path");
const multer = require("multer");

const AVATAR_DIR = path.join(__dirname, "..", "uploads", "avatar");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// La carpeta destino debe existir antes de que multer intente escribir
fs.mkdirSync(AVATAR_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, AVATAR_DIR);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, uniqueName);
    },
});

function fileFilter(req, file, cb) {
    if (!MIME_TYPES.includes(file.mimetype)) {
        return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "avatar"));
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
function uploadAvatar(req, res, next) {
    upload.single("avatar")(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).send({ msg: "El avatar no puede superar los 5 MB" });
            }
            return res
                .status(400)
                .send({ msg: "El avatar debe ser una imagen (jpg, png, webp o gif)" });
        }
        if (error) {
            return res.status(500).send({ msg: "Error al subir el avatar" });
        }
        next();
    });
}

module.exports = uploadAvatar;
