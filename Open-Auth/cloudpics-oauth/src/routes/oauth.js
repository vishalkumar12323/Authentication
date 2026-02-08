import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { oauthClient, authCodes } from "../data/store.js";

const router = express.Router();

router.get("/oauth/authorize", (req, res) => {
    const { client_id, redirect_uri, scope, response_type, } = req.query;

    if (response_type !== "code") {
        res.status(400).send("Unsupported response type.");
    };
    const client = oauthClient.find((c) => c.clientId === client_id);
    if (!client || client.redirectUri !== redirect_uri) {
        res.status(400).send("Invalid client");
    };

    res.send(
        `
        <h2>${client.name} wants access</h2>
        <p>Requested scope: ${scope}</p>

        <form method="POST" action="/oauth/approve">
        <input type="hidden" name="client_id" value="${client_id}" />
        <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
        <input type="hidden" name="scope" value="${scope}" />
        <button type="submit">Approve</button>
        </form>
    `
    );
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

export default router;