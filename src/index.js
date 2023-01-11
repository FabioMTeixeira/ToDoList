const express = require('express'); //criação do servidor
const mongoose = require('mongoose'); //banco de dados
const uniqueValidator = require('mongoose-unique-validator');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs'); //encriptador de senhas

const models = require('./models');
const userServices = require('./services/user_services');
const listService = require('./services/list_service');
const taskService = require('./services/task_service');
const validationService = require('./services/validation_service');
const { authentication } = require('./middlewares');

const { stringify } = require('querystring');

const app = express();
app.use(express.json());

const PORT = 3000;
const DATABASE_URL = 'mongodb://localhost:27017/todolist';

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

    const { error, user } = await userServices.createUser(username, password);

    if(error) {
        return res.status(400).json({ error });
    }

    res.status(201).json({ user });
});

app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    
    const { error, user } = await userServices.authUser(username,password);

    if(error) {
        return res.status(401).json(error);
    }

    const token = await userServices.generateToken(user.id);

    res.status(200).json({ token });
});

app.get('/auth/test', authentication, async (req, res) => {
    const user = await models.User.findById(req.userId);

    res.status(200).json({ user });
});

app.get('/lists', authentication, async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.userId);
    const lists = await models.List.find({ userId }, ['name']);

    res.status(200).json(lists);
});

app.post('/lists', authentication, async (req, res) => {
    const { name } = req.body;
    const { userId } = req.userId;

    const { list, error } = await listService.create(userId, name);

    if (error) {
        res.status(400).json(error);
    }

    res.status(201).json({ list });
});

app.put('/lists/:id', authentication, async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if(validationService.isBlank(name)) {
        return res.status(400).json({ error: 'invalid credentials' });
    }

    const list = await models.List.updateOne({ _id: id }, { name });

    res.status(200).json(list);
});

app.get('/lists/:id', authentication, async (req, res) => {
    const { id } = req.params;
    const { userId } = req;
    const { completedTasks } = req.query;

    const { error, list } = await listService.find(userId, id);

    if(error) {
        return res.status(404).json({ error });
    }
    
    const { tasksError, tasks } = await taskService.findTasks(id, { completedTasks });

    return res.status(200).json({ list, tasks });
});

app.post('/lists/:listId/tasks', authentication, async (req, res) => {
    const { listId } = req.params;
    const { userId } = req;
    const { error, list } = await listService.find(userId, listId);

    if(error) {
        return res.status(404).json({ error });
    }

    const { title } = req.body;
    const { taskError, task } = await taskService.createTask(list.id, title);

    if(taskError) {
        return res.status(400).json({ error });
    }

    res.status(200).json({ task });
});

app.put('/lists/:listId/tasks/:id', authentication, async (req, res) => {
    const { listId, id } = req.params;
    const { userId } = req;
    const { error } = await listService.find(userId, listId);

    if(error) {
        return res.status(404).json({ error });
    }

    const { title } = req.body;
    const { task } = await taskService.updateTask(id, title);

    res.status(200).json({ task })
});

app.post('/tasks/:id/completed_tasks', authentication, async (req, res) => {
    const { id } = req.params;
    const { userId } = req;

    const { task } = await taskService.findTask(id);
    const { error } = await listService.find(userId, task.listId);

    if(error) {
        return res.status(401).json({ error });
    }

    const result = await taskService.completeTask(id);

    res.status(200).json({ task: result.task });
});

main();