const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Devuelve la ruta relativa a /uploads, que es la carpeta estática:
// uploads/avatar/123.png  ->  avatar/123.png
function getFilePath(file) {
    if (!file) return null;
    return path.relative(UPLOADS_DIR, file.path).split(path.sep).join("/");
}

// Borra un archivo ya subido (por ejemplo si falla el guardado en base de datos)
function removeFile(file) {
    if (!file) return;
    fs.promises.unlink(file.path).catch(() => { });
}

module.exports = {
    getFilePath,
    removeFile,
};
