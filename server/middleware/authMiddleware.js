const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from cookies
    const token = req.cookies.token;

    // Check if not token
    if (!token) {
        return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_agro_token');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, msg: 'Token is not valid' });
    }
};
