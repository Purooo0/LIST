const mongoose = require('mongoose');

const ReadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    publisher: {
        type: String,
        required: [true, 'Publisher is required']
    },
    status: {
        type: String,
        enum: {
            values: ['Ready to Start', 'Reading', 'Finished'],
            message: 'Status must be either "Reading to Start", "Reading", or "Finished"'
        },
        required: [true, 'Status is required']
    },
    score: {
        type: Number,
        min: [1, 'Score must be at least 1'],
        max: [5, 'Score must be at most 5'],
        required: [true, 'Score is required']
    },
});

const Read = mongoose.model('Read', ReadSchema);

module.exports = Read;