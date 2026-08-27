const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');

const ACCESS_TOKEN_EXPIRES_IN = "3h";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

function createAccessToken(user) {
    return jwt.sign(
        { token_type: "access", user_id: user._id },
        JWT_SECRET_KEY,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
}

function createRefreshToken(user) {
    return jwt.sign(
        { token_type: "refresh", user_id: user._id },
        JWT_SECRET_KEY,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
}

// Comprueba la FIRMA y la expiración del token. Lanza un error si algo falla:
//   TokenExpiredError  -> el token venció
//   JsonWebTokenError  -> firma inválida o token mal formado
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyToken
};
