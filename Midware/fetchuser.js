const jwt = require('jsonwebtoken');
let JWT_MSG = "My Privet Massage"
const fetchuser = (req, res, next) => {

    // Get user from the jwt token and add it to req object;
    
    const token = req.header('jwt-token')
    if (!token) {
        return res.status(401).send({ error: "Please authanticate with a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_MSG)
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authanticate with a valid token" })
    }
}

module.exports = fetchuser;