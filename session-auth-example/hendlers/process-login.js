export const processLogin = (req, res) => {
    const {username, password} = req.body;

    if(username !== "admin" || password !== "password123") {
        return res.send("Invlid username or password");
    }

    req.session.userId = req.body.username;
    res.redirect("/");
}