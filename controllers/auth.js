const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const statusCodes = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res, next) => {
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(statusCodes.CREATED).json({user: {name: user.getName()}, token});
}

const login = (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password)
    {
        throw new BadRequestError('Please provide email and password');
    }

    const user = User.findOne({email});
    if(!user)
    {
        throw new UnauthenticatedError('Invalid credentials');
    }
    
    // compare passwords
    const isPasswordCorrect = user.comparePassword(password);
    if(!isPasswordCorrect)
    {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(statusCodes.OK).json({user: {name: user.getName()}, token});
}

module.exports = {
    register,
    login
}