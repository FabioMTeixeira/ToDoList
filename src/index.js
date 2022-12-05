const express = require('express'); //criação do servidor
const mongoose = require('mongoose'); //banco de dados
const uniqueValidator = require('mongoose-unique-validator');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs'); //encriptador de senhas

const models = require('./models');
const services = require('./services');

const { stringify } = require('querystring');

const app = express();
app.use(express.json());

const PORT = 3000;
const DATABASE_URL = 'mongodb://localhost:27017/todolist';
const JWT_SECRET = 'SUPERSECRET';
const SALT = '$2a$10$k6LLGppeZOiifBpEC/teA.';

const main = async () => {
    try {
        await mongoose.connect(DATABASE_URL);

        app.listen(PORT, () => {
            console.log(`Up and running on PORT ${PORT}`)
        });
    } catch(error) {
        console.error(error);
        process.exit(1);
    };
};

app.get('/salt', async (req, res) => {
    bcrypt.genSalt().then((salt) => {
        res.status(200).json({ salt });
    });
});

app.post('/users', async (req, res) => {
    const { username, password } = { ...req.body };

    const { status, json } = await services.createUser(username, password);

    res.status(status).json(json);
});

app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    
    const { error, user } = await services.authUser(username,password);

    if(error) {
        return res.status(401).json(error);
    }

    const token = await services.generateToken(user.id);

    res.status(200).json({ token });
});

const authentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        return res.status(401).json({ error: 'invalid credentials' });
    };

    const [_, token] = authHeader.split(' ');
    if(!token) {
        return res.status(401).json({ error: 'invalid credentials' });
    };

    jwt.verify(token, JWT_SECRET, (error, payload) => {
        if(error) {
            return res.status(401).json({ error });
        }

        req.userId = payload.sub;
        next();
    });
};

app.get('/auth/test', authentication, async (req, res) => {
    const user = await models.User.findById(req.userId);

    res.status(200).json({ user });
});

app.get('/lists', authentication, async (req, res) => {
    const lists = await models.List.find({ userId: req.userId }, ['name']);

    res.status(200).json(lists);
});

app.post('/lists', authentication, async (req, res) => {
    const { name } = req.body;

    if(!name || name.trim() ==='') {
        return res.status(400).json({ error: 'invalid credentials' })
    };

    const list = new models.List({ name, userId: req.userId });
    await list.save().then((document) => {
        res.status(201).json(document);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

app.put('/lists/:id', authentication, async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if(!name || name.trim() === '') {
        return res.status(400).json({ error: 'invalid credentials' });
    }

    const list = await models.List.updateOne({ _id: id }, { name });

    res.status(200).json(list);
});

main();