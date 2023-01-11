const { default: mongoose } = require('mongoose');
const { userInfo } = require('os');
const models = require('../models');
const validationService = require('./validation_service');

exports.createTask = async (listId, title) => {
    const data = { listId, title };
    const task = new models.Task(data);

    if(validationService.isBlank(title)) {
        return { error: 'invalid title' }; //1h34min semana 7
    }

    return task.save()
        .then((document) => ({ task: document }))
        .catch((error) => ({ error }));
};

exports.findTasks = async (listId, filters) => {
    const { completedTasks } = filters;

    let query = { listId: mongoose.Types.ObjectId(listId) };
    
    if (completedTasks !== "true") {
        query['completedAt'] = { "$exists": false };
    };

    const fields = ['_id', 'title', 'completedAt', 'updatedAt'];
    const tasks = await models.Task.find(query, fields);

    return { tasks };
};

exports.updateTask = async(taskId, title) => {
    const task = await models.Task.findById(taskId);
    task.title = title;
    task.updatedAt = new Date();

    await task.save();

    return { task };
};

exports.findTask = async (taskId) => {
    const task = await models.Task.findById(taskId);

    return { task };
};

exports.completeTask = async (taskId) => {
    const { task } = await this.findTask(taskId); 

    const now = new Date();
    task.completedAt = now;
    task.updatedAt = now;

    await task.save();

    return { task };
};