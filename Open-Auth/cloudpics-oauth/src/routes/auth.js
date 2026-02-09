import express from "express";
import bcrypt from "bcrypt";
import { users } from "../data/store.js";

const router = express.Router();

router.get("/login", (req, res) => {
    if(req.cookies.userId) {
        return res.redirect("/dashboard/your-photos");
    }
    return res.render("login.ejs");
})

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).render("login.ejs", {errorMessage: "Invalid credentials."});

    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).render("login.ejs", {errorMessage: "Invalid credentials."});

    res.cookie("userId", user.id, { httpOnly: true });
    return res.redirect("/dashboard/your-photos")
});

export default router;