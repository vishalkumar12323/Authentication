import jwt from "jsonwebtoken";

export const requireAccessToken = (requiredScope) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "missing_token" });
        }
        const token = authHeader.split(" ")[1];

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            // Scope check
            if (
                requiredScope &&
                !payload.scope.split(" ").includes(requiredScope)
            ) {
                return res.status(403).json({ error: "insufficient_scope" });
            }

            // Attach user info to request
            req.user = payload;
            next();
        } catch (err) {
            return res.status(401).json({ error: "invalid_or_expired_token" });
        }
    }
}