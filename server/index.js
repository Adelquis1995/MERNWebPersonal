const mongoose = require("mongoose");
const app = require("./app");
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    IP_SERVER,
    API_VERSION,
    PORT
} = require('./config');

// encodeURIComponent evita que un usuario o contraseña con caracteres
// especiales (@, :, /, ?) rompa la cadena de conexión
const MONGO_URI = `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}/`;

async function start() {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error.message);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`API REST corriendo en http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
    });
}

start();
