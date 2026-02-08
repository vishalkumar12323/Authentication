export const requireLogin = (req, res, next) => {
    if (!req.cookies.userId) {
        res.status(401).json({ message: "Login Required." });
    };
    next();
}