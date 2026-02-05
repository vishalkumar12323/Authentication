export const homeHandler = (req, res) => {
    if(!req.session.userId) {
        return res.status(301).redirect("/login");
    }

    res.write(
        `
            <h1> Welcome back ${req.session.userId} </h1>
            <a href="/logout"> Logout </a>
        `
    );

    res.end();
}