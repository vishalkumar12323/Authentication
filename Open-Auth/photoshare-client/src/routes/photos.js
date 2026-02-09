import express from "express";
import axios from "axios";
import { cloudpics } from "../oauth/cloudpics.js";
import tokens, { photos } from "../data/store.js";

const router = express.Router();

router.get("/import-photos", async (req, res) => {
  try {
    const response = await axios.get(cloudpics.photosUrl, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    photos.push(response.data);

    res.redirect("/dashboard/photos");
  } catch (err) {
    if (err.response?.status === 401) {
      return res.redirect("/refresh-token");
    }
    res.status(500).send("Failed to load photos");
  }
});

export default router;
