import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import oauthRoutes from "./routes/oauth.js"

const app = express();
const PORT = process.env.PORT ?? 4489;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(authRoutes);
app.use(oauthRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is up and running." });
});

app.listen(PORT, () => console.log(`Cloudpics Oauth server running at http://localhost:${PORT}`));