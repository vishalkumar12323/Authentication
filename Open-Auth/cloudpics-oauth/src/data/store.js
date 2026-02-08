import bcrypt from "bcrypt";

const users = [
    {
        id: 1,
        email: "vishal@gmail.com",
        password: bcrypt.hashSync("password123", 10)
    }
];

const oauthClient = [
    {
        clientId: "photoshare",
        clientSecret: "photoshare-secret",
        redirectUri: "http://localhost:4000/oauth/cloudpics/callback",
        name: "PhotoShare"
    }
];

const authCodes = [];

export { users, oauthClient, authCodes };