import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import oauthRoutes from "./routes/oauth.js";
import photosRoutes from "./routes/photos.js";
import { photos } from "./data/store.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRoutes);
app.use(oauthRoutes);
app.use(photosRoutes);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "EJS is fun",
    message: "Welcome to templating using EJS!",
  });
});

app.get("/dashboard/photos", (_req, res) => {
  console.log("photos:: ", photos);
  // Assuming user always loggedIn
  res.render("photos.ejs", {
    photos: [],
  });
});

app.listen(4000, () => {
  console.log("PhotoShare Server running at http://localhost:4000");
});
