const jwt = require("../utils/jwt.js");

function asureAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({ msg: "La petición no tiene la cabecera de autenticación" });
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    let payload;
    try {
        // verifyToken valida la firma y la expiración
        payload = jwt.verifyToken(token);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).send({ msg: "El token ha expirado" });
        }
        return res.status(400).send({ msg: "Token inválido" });
    }

    // Un refresh token no sirve para autenticar peticiones
    if (payload.token_type !== "access") {
        return res.status(400).send({ msg: "Token inválido" });
    }

    req.user = payload;
    next();
}

module.exports = asureAuth;
