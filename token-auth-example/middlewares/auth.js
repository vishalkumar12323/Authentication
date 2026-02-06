import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied, Token Required." });
    };

    jwt.verify(token, "MYJWTSECRETS", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or token expired." });
        }
        req.user = user;
        next();
    })
}

export function generateToken({ userId = "", username = "" }) {
    return jwt.sign({ userId, username }, "MYJWTSECRETS", {
        algorithm: "HS256",
        expiresIn: "2m"
    });
}