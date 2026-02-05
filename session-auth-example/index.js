import express from "express";
import session from "express-session";
import { homeHandler } from "./hendlers/home.js";
import { loginHandler } from "./hendlers/login.js";
import { processLogin } from "./hendlers/process-login.js";
import { logoutHandler } from "./hendlers/logout.js";


const app = express();
const PORT = process.env.PORT ?? 6678;

app.use(session({
    secret: process.env.SESSION_SECRET ?? "SOMERENDOMSECRET",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    resave: true,
    saveUninitialized: false,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", homeHandler);

app.get("/login", loginHandler);

app.post('/process-login', processLogin);

app.get("/logout", logoutHandler);

app.listen(PORT, () => console.log(`Server running at: http://localhost:${PORT}`));