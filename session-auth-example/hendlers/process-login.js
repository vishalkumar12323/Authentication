export const processLogin = (req, res) => {
    const { username, password } = req.body;

    if (username !== "admin" || password !== "password123") {
        return res.send("Invlid username or password");
    }

    const user = {
        name: "Vishal Kumar",
        email: "vishal@gmail.com",
        phone_no: "8949087009"
    }
    req.session.userId = req.body.username;
    req.session.user = user;
    res.status(200).json({ status: 'success', userId: username });
}