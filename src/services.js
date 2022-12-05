const bcrypt = require('bcryptjs'); //encriptador de senhas
const models = require('./models');

const jwt = require('jsonwebtoken');

const JWT_SECRET = 'SUPERSECRET';
const SALT = '$2a$10$k6LLGppeZOiifBpEC/teA.';


exports.createUser = async (username, password) => {
    if(!password || password.trim() === '') {
        return { 
            status: 400, 
            json: { 
                error: 'invalid password' 
            } 
        };
    };

    if(!username || username.trim() === '') {
        return { 
            status: 400, 
            json: { 
                error: 'invalid username' 
            } 
        };
    };

    return bcrypt.hash(password, SALT).then(async (hash) => {
        const data = {
            username,
            password: hash
        };

        const user = new models.User(data);

        return user.save()
            .then((document) => ({ status: 201, json: document }))
            .catch((error) => ({ status: 400, json: error }));    
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