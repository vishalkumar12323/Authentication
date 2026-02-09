import axios from "axios";
import express from "express";
import { cloudpics } from "../oauth/cloudpics.js";
import tokens from "../data/store.js";

const router = express.Router();

router.get("/oauth/cloudpics/callback", async (req, res) => {
    const { code } = req.query;

    try {
        const tokenRes = await axios.post(cloudpics.tokenUrl, {
            grant_type: "authorization_code",
            code,
            client_id: cloudpics.clientId,
            client_secret: cloudpics.clientSecret,
            redirect_uri: cloudpics.redirectUri,
        });

        tokens.accessToken = tokenRes.data.access_token;
        tokens.refreshToken = tokenRes.data.refresh_token;

        res.send("OAuth success! You can now import photos.");
    } catch (err) {
        console.log("Error:: ", err);
        res.status(500).send("OAuth failed");
    }
});

export default router;