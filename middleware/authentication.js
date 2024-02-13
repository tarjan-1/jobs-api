const jwt = require('jsonwebtoken');

const User = require('../models/User');
const UnauthenticatedError = require('../errors/unauthenticated');

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer'))
    {
        console.log('error in authHeader');
        throw new UnauthenticatedError('Authentication Invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // attach the user to the job routes
        req.user = {userId: payload.userId, name: payload.name};
        next();
        
    } catch (error) {
        console.log('error in token or parsing token data', error.message);
        throw new UnauthenticatedError('Authentication Invalid');
    }
}

module.exports = auth;