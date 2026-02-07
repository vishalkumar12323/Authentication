import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT ?? 4489;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is up and running." });
});

app.listen(PORT, () => console.log(`Cloudpics Oauth server running at http://localhost:${PORT}`));