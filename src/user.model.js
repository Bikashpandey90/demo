const mongoose = require("mongoose");
const { schemaOpts } = require("./common/schema");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer',
        required: true
    }


}, schemaOpts)
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;