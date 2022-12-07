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
    }, ['_id', 'title']);

    return { tasks };
}