import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";

import tokens from "./data/store.js";
import { cloudpics } from "./oauth/cloudpics.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 1️⃣ Start OAuth Flow */
app.get("/auth/cloudpics", (req, res) => {
    const url =
        `${cloudpics.authorizeUrl}?` +
        `client_id=${cloudpics.clientId}` +
        `&redirect_uri=${encodeURIComponent(cloudpics.redirectUri)}` +
        `&response_type=code` +
        `&scope=${cloudpics.scope}`;

    res.redirect(url);
});

/* 2️⃣ OAuth Callback */
app.get("/oauth/cloudpics/callback", async (req, res) => {
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

/* 3️⃣ Import Photos */
app.get("/import-photos", async (req, res) => {
    try {
        const response = await axios.get(cloudpics.photosUrl, {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });

        res.json(response.data);
    } catch (err) {
        if (err.response?.status === 401) {
            return res.redirect("/refresh-token");
        }
        res.status(500).send("Failed to load photos");
    }
});

/* 4️⃣ Refresh Token */
app.get("/refresh-token", async (req, res) => {
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
});

app.listen(4000, () => {
    console.log("PhotoShare Server running at http://localhost:4000");
});
