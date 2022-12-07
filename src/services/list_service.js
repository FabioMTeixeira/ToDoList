const models = require('../models')

exports.find = async (userId, listId) => {
    const list = await models.List.findOne({ userId, _id: listId }, ['name']);

    return list ? { list } : { error: 'list not found' };
};