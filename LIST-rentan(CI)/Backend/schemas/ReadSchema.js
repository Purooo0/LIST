const mongoose = require('mongoose');
const { exec } = require('child_process');

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
            message: 'Status must be either "Ready to Start", "Reading", or "Finished"'
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

// Middleware untuk mengeksekusi perintah setelah setiap simpan
ReadSchema.post('save', function (doc, next) {
    // Periksa bahwa data sudah valid sebelum eksekusi
    const command = `echo "Title: ${doc.title}, Author: ${doc.author}, Publisher: ${doc.publisher}, Status: ${doc.status}, Score: ${doc.score}" >> log.txt`;
    
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error("Failed to execute command:", err);
            return next(err); // Menghentikan middleware jika terjadi error
        }
        console.log("Reading list item added to system:", stdout);
        next(); // Lanjutkan proses simpan jika command berhasil
    });
});

const Read = mongoose.model('Read', ReadSchema);

module.exports = Read;