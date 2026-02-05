import express from "express";
import session from "express-session";


const app = express();
const PORT = process.env.PORT ?? 6678;

app.use(session({
    secret: process.env.SESSION_SECRET ?? "SOMERENDOMSECRET",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    },
    resave: true,
    saveUninitialized: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`Server running at: http://localhost:${PORT}`));