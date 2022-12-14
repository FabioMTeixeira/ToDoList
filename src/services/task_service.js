const { default: mongoose } = require('mongoose');
const { userInfo } = require('os');
const models = require('../models');

exports.createTask = async (listId, title) => {
    const data = { listId, title };
    const task = new models.Task(data);

    return task.save()
        .then((document) => ({ task: document }))
        .catch((error) => ({ error }));
};

exports.findTasks = async (listId) => {
    const tasks = await models.Task.find({ 
        listId: mongoose.Types.ObjectId(listId) 
    }, ['_id', 'title', 'updatedAt']);

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