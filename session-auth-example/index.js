import express from "express";
import session from "express-session";
import { homeHandler } from "./hendlers/home.js";
import { loginHandler } from "./hendlers/login.js";
import { processLogin } from "./hendlers/process-login.js";
import { logoutHandler } from "./hendlers/logout.js";
import { redisClient } from "./redis/client.js"
import { RedisStore } from "connect-redis";

const app = express();
const PORT = process.env.PORT ?? 6678;

app.use(session({
    name: "sid",
    secret: process.env.SESSION_SECRET ?? "SOMERENDOMSECRET",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod" ? true : false,
        sameSite: 'lax'
    },
    resave: true,
    saveUninitialized: false,
    store: new RedisStore({
        client: redisClient,
        prefix: "sess",
    })
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", homeHandler);

app.get("/login", loginHandler);

app.post('/process-login', processLogin);

app.get("/logout", logoutHandler);

app.listen(PORT, () => console.log(`Server running at: http://localhost:${PORT}`));