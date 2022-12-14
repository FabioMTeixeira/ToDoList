const mongoose = require('mongoose'); //banco de dados
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

UserSchema.plugin(uniqueValidator);

exports.User = new mongoose.model('User', UserSchema);

const ListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        requires: true 
    }
}); 

ListSchema.index({ name: 1, userId: 1 }, { unique: true });

exports.List = new mongoose.model('List', ListSchema);

const TaskSchema = new mongoose.Schema({
    title:{ type: String, required: true, minLength: 1 },
    listId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:'List',
        requires: true 
    },
    completedAt: { type: Date },
    updatedAt: { type: Date }
});

exports.Task = new mongoose.model('Task', TaskSchema);