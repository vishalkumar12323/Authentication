import express from "express";
import { requireAccessToken } from "../middleware/requireAccessToken.js";
import { users } from "../data/store.js";

const router = express.Router();

router.get("/dashboard/your-photos", (req, res) => {
    const userId = req.cookies.userId;
    if(!userId) {
        res.redirect("/login");
    }
    const user = users.find((user) => user.id === Number(userId));
    res.render('user-dashboard.ejs',{
        user,
        photos: [
            { id: 1, name: "beach.jpeg", url: "https://beach.photo" },
            { id: 2, name: "mountains.png", url: "https://mountains.photo" }
        ]
    })
})

router.get("/photos", requireAccessToken("read:photos"), (req, res) => {
    res.json({
        user: req.user.userId,
        photos: [
            { id: 1, name: "beach.jpeg", url: "https://beach.photo" },
            { id: 2, name: "mountains.png", url: "https://mountains.photo" }
        ]
    })
})

export default router;