import express from "express";
import { cloudpics } from "../oauth/cloudpics.js";
import axios from "axios";
import tokens from "../data/store.js";

const router = express.Router();


router.get('/auth/cloudpics', (req, res) => {
    const url =
        `${cloudpics.authorizeUrl}?` +
        `client_id=${cloudpics.clientId}` +
        `&redirect_uri=${encodeURIComponent(cloudpics.redirectUri)}` +
        `&response_type=code` +
        `&scope=${cloudpics.scope}`;

    res.redirect(url);
});


/* 4️⃣ Refresh Token */
router.get("/refresh-token", async (req, res) => {
    try {
        const response = await axios.post(cloudpics.tokenUrl, {
            grant_type: "refresh_token",
            refresh_token: tokens.refreshToken,
            client_id: cloudpics.clientId,
            client_secret: cloudpics.clientSecret,
        });

        tokens.accessToken = response.data.access_token;
        res.redirect("/import-photos");
    } catch {
        res.status(401).send("Re-authentication required");
    }
})

export default router;