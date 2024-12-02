const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
    user_id:{
        type: String,
        default: uuidv4,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
 
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: function(v) {
                return v.length >= 8;
            },
            message: 'Password must be at least 8 characters long'
        }
    }
});
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
const User = mongoose.model('User', UserSchema);

module.exports = User;