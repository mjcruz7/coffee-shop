const jwt = require('jsonwebtoken');
const path = require('path');

const validateToken = (req, res, next) => {
    const token = req.get('token');

    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                message: 'No token provided.'
            }
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        req.user = decoded.user;
        next();
    });
};

const validateRole = (req, res, next) => {
    const user = req.user;

    if (!user || user.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            success: false,
            error: {
                message: 'Not enough privileges.'
            }
        });
    }

    next();
};

const validateImageToken = (req, res, next) => {
    const token = req.query.token;
    const forbiddenImagePath = path.resolve(__dirname, '../assets/img/403.png');

    if (!token) {
        return res.sendFile(forbiddenImagePath);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.sendFile(forbiddenImagePath);
        }

        req.user = decoded.user;
        next();
    });
};

module.exports = {
    validateToken,
    validateRole,
    validateImageToken
};