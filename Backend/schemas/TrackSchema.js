const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    days: {
        type: Map,
        of: Boolean,
        default: {
            Mon: false,
            Tue: false,
            Wed: false,
            Thu: false,
            Fri: false,
            Sat: false,
            Sun: false
        }
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
    }
});

const Track = mongoose.model('Track', TrackSchema);

module.exports = Track;