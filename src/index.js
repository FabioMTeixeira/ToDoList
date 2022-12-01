const express = require('express'); //criação do servidor
const mongoose = require('mongoose'); //banco de dados
const uniqueValidator = require('mongoose-unique-validator');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs'); //encriptador de senhas
const { stringify } = require('querystring');

const app = express();
app.use(express.json());

const PORT = 3000;
const DATABASE_URL = 'mongodb://localhost:27017/todolist';
const SALT = '$2a$10$k6LLGppeZOiifBpEC/teA.';
const JWT_SECRET = 'SUPERSECRET';

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

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

UserSchema.plugin(uniqueValidator);

const User = new mongoose.model('User', UserSchema);

const ListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true}
});

const List = new mongoose.model('List', ListSchema);

app.get('/salt', async (req, res) => {
    bcrypt.genSalt().then((salt) => {
        res.status(200).json({ salt });
    });
});

app.post('/users', async (req, res) => {
    const { username, password } = { ...req.body };

    if(!password || password.trim() === '') {
        return res.status(400).json({ error: 'invalid password' });
    };

    if(!username || username.trim() === '') {
        return res.status(400).json({ error: 'invalid username' });
    };

    bcrypt.hash(password, SALT).then(async (hash) => {
        const data = {
            username,
            password: hash
        };

        const user = new User(data);
        user.save().then((document) => {
            res.status(201).json(document);
        }).catch((error) => {
            res.status(400).json(error);
        });    
    });
});

app.post('/auth', async (req, res) => {
    const { username, password } = req.body;

    if(!password || password.trim() === '') {
        return res.status(401).json({ error: 'invalid credentials' });
    };

    if(!username || username.trim() === '') {
        return res.status(401).json({ error: 'invalid credentials' });
    };

    const user = await User.findOne({ username });

    if(!user) {
        return res.status(401).json({ error: 'invalid credentials' });
    };

    bcrypt.hash(password, SALT).then(async (hash) => {
        if(hash === user.password) {
            const token = jwt.sign({
                sub: user.id,
            }, JWT_SECRET, { expiresIn: '600s' });

            const data = {
                authenticated: true,
                token,
            };

            return res.status(200).json(data);
        }

        res.status(401).json({ error: 'invalid credentials' });
    });
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
    const user = await User.findById(req.userId);

    res.status(200).json({ user });
});

app.get('/lists', authentication, async (req, res) => {
    const lists = await List.find({ userId: req.userId }, ['name']);

    res.status(200).json(lists);
});

app.post('/lists', authentication, async (req, res) => {
    const { name } = req.body;

    if(!name || name.trim() ==='') {
        return res.status(400).json({ error: 'invalid credentials' })
    };

    const list = new List({ name, userId: req.userId });
    await list.save().then((document) => {
        res.status(201).json(document);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

main();