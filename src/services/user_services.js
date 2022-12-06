const bcrypt = require('bcryptjs'); //encriptador de senhas
const models = require('../models');

const jwt = require('jsonwebtoken');

const { SALT, JWT_SECRET } = require('../config');

exports.createUser = async (username, password) => {
    if(!password || password.trim() === '') {
        return { error: 'invalid password' };
    }

    if(!username || username.trim() === '') {
        return { error: 'invalid username' };
    }

    return bcrypt.hash(password, SALT).then(async (hash) => {
        const data = {
            username,
            password: hash
        };

        const user = new models.User(data);

        return user.save()
            .then((document) => ({ user: document }))
            .catch((error) => ({ error }));    
    });
};

exports.authUser = async (username, password) => {
    const invalidCredentialsError = { error: 'invalid credentials' };

    if(!password || password.trim() === '') {
        return invalidCredentialsError;
    };

    if(!username || username.trim() === '') {
        return invalidCredentialsError;
    };

    const user = await models.User.findOne({ username });

    if(!user) {
        return invalidCredentialsError;
    };

    return bcrypt.hash(password, SALT).then(async (hash) => {
        if(hash === user.password) {
            return { user };
        }

        return invalidCredentialsError;
    });
};

exports.generateToken = (userId) => {
    const token = jwt.sign({
        sub: userId,
    }, JWT_SECRET, { expiresIn: '600s' });

    return token;
};