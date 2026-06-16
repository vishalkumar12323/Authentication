export const homeHandler = (req, res) => {
    if (!req.session.userId) {
        res.setHeader("Content-Type", "text/html");
        return res.status(401).send(
            `
                <h1>This is protected page</h1>
                <p> To view this page, please <a href="/login">login here.</a> </p>
            `
        )
    }

    res.status(200).send(
        `
            <h1> Welcome back ${req.session.user.name} </h1>
            <p> ${JSON.stringify(req.session.user)} </p>
            <br>

            <a href="/logout">Logout</a>
        `
    )
};