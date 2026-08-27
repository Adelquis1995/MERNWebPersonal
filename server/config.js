// Carga las variables del archivo .env dentro de process.env.
// Se hace aquí (y no en index.js) para que funcione sea cual sea el
// archivo que se ejecute primero: el servidor, un script o un test.
require("dotenv").config({ quiet: true });

// Variables sin las que la API no puede arrancar
const REQUIRED = ["DB_USER", "DB_PASSWORD", "DB_HOST", "JWT_SECRET_KEY"];

const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length > 0) {
    throw new Error(
        `Faltan variables de entorno: ${missing.join(", ")}. ` +
        `Copia .env.example como .env y completa los valores.`
    );
}

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

const API_VERSION = process.env.API_VERSION || "v1";
const IP_SERVER = process.env.IP_SERVER || "localhost";
const PORT = process.env.PORT || 3977;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    API_VERSION,
    IP_SERVER,
    PORT,
    JWT_SECRET_KEY
};
