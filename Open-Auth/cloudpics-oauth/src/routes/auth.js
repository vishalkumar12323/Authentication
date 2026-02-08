import express from "express";
import bcrypt from "bcrypt";
import { users } from "../data/store.js";

const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    res.cookie("userId", user.id, { httpOnly: true });
    res.json({ message: "Login successed" });
});

export default router;