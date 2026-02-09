import bcrypt from "bcrypt";

const users = [
    {
        id: 1,
        name: "Vishal Kumar",
        email: "vishal@gmail.com",
        password: bcrypt.hashSync("password123", 10)
    }
];

const oauthClients = [
    {
        clientId: "photoshare",
        clientSecret: "photoshare-secret",
        redirectUri: "http://localhost:4000/oauth/cloudpics/callback",
        name: "PhotoShare"
    }
];

const authCodes = [];
const accessTokens = [];
const refreshTokens = [];

export { users, oauthClients, authCodes, accessTokens, refreshTokens };