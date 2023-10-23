import 'dotenv/config'

const googleProtect = (oAuth) => async (req, res, next) => {
    const id_token = req.body.token
    let isAuthenticated = false;
    try {
        const ticket = await oAuth.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        isAuthenticated = true;
        req.email = ticket.payload.email
        console.log("Email From googleProtect ", req.email)
    } catch (err) {
        console.log("Route Protection Error (googleProtect) : ", err);
        res.json({message: "Not Authorized"}); // Use res.sendStatus(403) to send a 403 status code.
        return;
    }

    if (isAuthenticated) {
        next();
    } else {
        res.json({message: "Not Authorized"});
        return;
    }
};

export { googleProtect }