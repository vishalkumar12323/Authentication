export const cloudpics = {
    authorizeUrl: "http://localhost:4489/oauth/authorize",
    tokenUrl: "http://localhost:4489/oauth/token",
    photosUrl: "http://localhost:4489/photos",

    clientId: "photoshare",
    clientSecret: "photoshare-secret",
    redirectUri: "http://localhost:4000/oauth/cloudpics/callback",
    scope: "read:photos",
};
