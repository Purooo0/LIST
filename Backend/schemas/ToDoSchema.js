const mongoose = require('mongoose');
const Read = require('./ReadSchema');

const TodoListSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required']
    },
    description:{
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: String,
        enum: {
            values: ['Pending', 'Done'],
            message: 'Status must be either Pending or Done'
        },
        required: [true, 'Status is required']
    },
    due: {
        type: Date,
        required: [true, 'Due date is required']
    },
});

const List = mongoose.model('List', TodoListSchema);

module.exports = List;