const listService = require('./list_service');
const taskService = require('./task_service');

exports.canAccessList = async (userId, listId) => {
    const { error } = await listService.find(userId, listId);

    return error;
};

exports.canAccessTask = async (userId, taskId) => {
    const { task } = await taskService.findTask(id);

    return this.canAccessList(task.listId);
}