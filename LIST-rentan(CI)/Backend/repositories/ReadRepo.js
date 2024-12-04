const { exec } = require('child_process');
const http = require("http");
const Read = require("../schemas/ReadSchema");

// Fungsi untuk menjalankan perintah exec dan membungkusnya dalam Promise
const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(new Error("Failed to execute command"));
            } else {
                resolve(stdout);
            }
        });
    });
};

async function addRead(req, res) {
    const { title, author, publisher, status, score } = req.body;

    // Membuat perintah shell yang rentan terhadap Command Injection
    const command = `echo "Title: ${title}, Author: ${author}, Publisher: ${publisher}, Status: ${status}, Score: ${score}" >> log.txt`;

    try {
        // Menjalankan perintah shell menggunakan exec dan menunggu hingga selesai
        const result = await executeCommand(command);
        console.log('Reading list item added to system:', result); // Output dari exec

        // Menyimpan data baru ke MongoDB
        const read = new Read({ title, author, publisher, status, score });
        await read.save();

        // Pastikan hanya satu respon yang dikirimkan setelah semua selesai
        return res.status(201).json({
            message: "New reading list successfully added",
            data: read
        });
    } catch (error) {
        // Menangani error jika ada pada perintah exec atau saat penyimpanan di MongoDB
        console.error("Error:", error);

        // Pastikan hanya satu respon dikirimkan
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
}

async function getAllReads(req, res) {
    try {
        const allReadingList = await Read.find();
        if (!res.headersSent) {  // Pastikan headers belum dikirim
            return res.status(200).json({ message: "The entire reading list was successfully obtained", data: allReadingList });
        }
    } catch (error) {
        if (!res.headersSent) {  // Pastikan headers belum dikirim
            return res.status(400).json({ error: error.message });
        }
    }
}

async function updateRead(req, res) {
    const readingListId = req.params.id;
    const { title, author, publisher, status, score } = req.body;

    try {
        const readingListToUpdate = await Read.findByIdAndUpdate(readingListId, { title, author, publisher, status, score }, { new: true });
        if (!readingListToUpdate) {
            return res.status(404).json({ error: "Reading list not found" });
        }
        return res.status(200).json({ message: "Reading list updated successfully", data: readingListToUpdate });
    } catch (error) {
        if (!res.headersSent) {  // Pastikan headers belum dikirim
            return res.status(400).json({ error: error.message });
        }
    }
}

async function deleteRead(req, res) {
    const readingListId = req.params.id;
    try {
        const readingListToDelete = await Read.findByIdAndDelete(readingListId);
        if (!readingListToDelete) {
            return res.status(404).json({ error: "Reading list not found" });
        }
        return res.status(200).json({ message: "Reading list deleted successfully" });
    } catch (error) {
        if (!res.headersSent) {  // Pastikan headers belum dikirim
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = { addRead, getAllReads, updateRead, deleteRead };