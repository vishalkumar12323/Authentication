import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path"
import {fileURLToPath} from "url";

import authRoutes from "./routes/auth.js";
import oauthRoutes from "./routes/oauth.js";
import photosRoutes from "./routes/photos.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4489;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.set("view engine", "ejs");

app.use(authRoutes);
app.use(oauthRoutes);
app.use(photosRoutes);


app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is up and running." });
});

app.listen(PORT, () => console.log(`Cloudpics Oauth server running at http://localhost:${PORT}`));