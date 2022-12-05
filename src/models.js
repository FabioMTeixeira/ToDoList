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
    userId: { type: String, required: true}
});

exports.List = new mongoose.model('List', ListSchema);