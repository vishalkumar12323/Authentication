import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { oauthClients, authCodes, accessTokens, refreshTokens } from "../data/store.js";

const router = express.Router();

router.get("/oauth/authorize", (req, res) => {
    const { client_id, redirect_uri, scope, response_type, } = req.query;

    if (response_type !== "code") {
        return res.status(400).send(`
                <div style="background: #1e1e1e; color: #fff; height: 100vh; display: flex;
                align-items: center; justify-content: center; text-transform: capitalize; font-size: 30px;">
                    Unsupported response type
                </div>
            `);
    };
    const client = oauthClients.find((c) => c.clientId === client_id);
    if (!client || client.redirectUri !== redirect_uri) {
        return res.status(400).send(`
                <div style="background: #1e1e1e; color: #fff; height: 100vh; display: flex;
                align-items: center; justify-content: center; text-transform: capitalize; font-size: 30px;">
                    Invalid client
                </div>
            `);
    };

    return res.render("approve.ejs", {
        client: client,
        scope: scope
    });
});


router.post("/oauth/approve", (req, res) => {
    const { client_id, redirect_uri, scope } = req.body;

    const code = uuidv4();

    authCodes.push({
        code,
        userId: req.cookies.userId,
        clientId: client_id,
        scope,
        expireAt: Date.now() + 5 * 60 * 1000,
        used: false
    });

    res.redirect(`${redirect_uri}?code=${code}`);
});


// Helper function to handle refresh token grant
function handleRefreshTokenGrant(req, res) {
    const { refresh_token, client_id, client_secret } = req.body;

    // Validate required fields
    if (!refresh_token || !client_id || !client_secret) {
        return res.status(400).json({ error: "missing_required_fields" });
    }

    const client = oauthClients.find(
        c => c.clientId === client_id && c.clientSecret === client_secret
    );

    if (!client) {
        return res.status(401).json({ error: "invalid_client" });
    }

    const storedToken = refreshTokens.find(
        t => t.token === refresh_token && t.clientId === client_id
    );

    if (!storedToken) {
        return res.status(400).json({ error: "invalid_refresh_token" });
    }

    if (storedToken.expiresAt < Date.now()) {
        return res.status(400).json({ error: "refresh_token_expired" });
    }

    const newAccessToken = jwt.sign(
        {
            userId: storedToken.userId,
            scope: storedToken.scope,
            clientId: storedToken.clientId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    return res.json({
        access_token: newAccessToken,
        token_type: "Bearer",
        expires_in: 900,
        scope: storedToken.scope,
    });
}

router.post("/oauth/token", (req, res) => {
    const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;

    // Validate grant_type
    if (!grant_type) {
        return res.status(400).json({ error: "missing_grant_type" });
    }

    if (grant_type === "refresh_token") {
        return handleRefreshTokenGrant(req, res);
    }

    if (grant_type !== "authorization_code") {
        return res.status(400).json({ error: "unsupported_grant_type" });
    }

    // Validate required fields for authorization_code grant
    if (!code || !client_id || !client_secret || !redirect_uri) {
        return res.status(400).json({ error: "missing_required_fields" });
    }

    // Validate client
    const client = oauthClients.find(
        c => c.clientId === client_id && c.clientSecret === client_secret
    );

    if (!client || client.redirectUri !== redirect_uri) {
        return res.status(401).json({ error: "invalid_client" });
    }

    // Validate authorization code
    const authCode = authCodes.find(c => c.code === code);

    if (!authCode) {
        return res.status(400).json({ error: "invalid_grant" });
    }

    if (authCode.used) {
        return res.status(400).json({ error: "authorization_code_used" });
    }

    if (authCode.expiresAt < Date.now()) {
        return res.status(400).json({ error: "authorization_code_expired" });
    }

    // Mark code as used
    authCode.used = true;

    // Generate access token
    const accessToken = jwt.sign(
        {
            userId: authCode.userId,
            scope: authCode.scope,
            clientId: authCode.clientId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = uuidv4();

    refreshTokens.push({
        token: refreshToken,
        userId: authCode.userId,
        clientId: authCode.clientId,
        scope: authCode.scope,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: 900,
        scope: authCode.scope,
    });
});


export default router;