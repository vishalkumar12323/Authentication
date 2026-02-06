import express from "express";
import { authenticate, generateToken } from "./middlewares/auth.js"

const app = express();

const PORT = process.env.PORT ?? 7878;

const users = [
    { id: 1, username: "alice", password: 'alice123' },
    { id: 2, username: "adam", password: "adam123" }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "invalid credentials." });
    }

    const token = generateToken({ userId: user.id, username: user.username });

    res.status(200).json({ message: "Login successed", token });
});


app.get("/dashboard", authenticate, (req, res) => {
    res.json({
        message: `Welcome to Dashboard Page ${req.user.username}`,
        userId: req.user.userId
    });
})



app.listen(PORT, () => console.log(`Server listening at: http://localhost:${PORT}`));