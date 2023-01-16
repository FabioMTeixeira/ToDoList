const models = require('../models')
const validationService = require('./validation_service')

exports.find = async (userId, listId) => {
    const list = await models.List.findOne({ userId, _id: listId }, ['name']);

    return list ? { list } : { error: 'list not found' };
};

exports.create = async (userId, name) => {
        if (validationService.isBlank(name)) {
            return { error: 'invalid credentials' };
    }

    const list = new models.List({ name, userId });
    await list.save().then((document) => {
        return { list: document };
    }).catch((error) => {
            return { error };
        });
}