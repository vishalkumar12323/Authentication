import express from "express";
import { requireAccessToken } from "../middleware/requireAccessToken.js";

const router = express.Router();

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