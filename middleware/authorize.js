const jwt = require("jsonwebtoken");
const secretKey = "SUPER SECRET KEY DO NOT STEAL";
const authorize = function (req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        req.auth = false;
        next();
        return;
    }
    if (auth.split(" ").length !== 2) {
        res.status(401).json({
            error: true,
            message: "Authorization header is malformed"
        });
        return;
    }
    const token = auth.split(" ")[1];
    try {
        const payload = jwt.verify(token, secretKey);
        if (Date.now() > payload.exp) {
            res.status(401).json({
                error: true,
                message: "JWT token has expired"
            });
            return;
        }

        req.auth = true;
        req.email = payload.email;
        next();
    } catch (e) {
        res.status(401).json({
            error: true,
            message: "Invalid JWT token"
        });
        return;
    }
};

module.exports = authorize;