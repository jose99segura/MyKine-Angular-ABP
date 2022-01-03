const jwt = require('jsonwebtoken');
const infoToken = (token) => {
    return jwt.verify(token, process.env.JWTSECRET);
}
module.exports = { infoToken }