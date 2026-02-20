const jwt = require('jsonwebtoken');
const { getTokens } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'kodbank_secret_key_123';

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);

        // Check if token exists in storage (as per requirement 2)
        const tokens = getTokens();
        const tokenExists = tokens.find(t => t.token === token);

        if (!tokenExists) {
            return res.status(401).json({ message: 'Invalid or Expired Session' });
        }

        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

module.exports = authenticateToken;
