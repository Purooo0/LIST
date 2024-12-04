const express = require("express");
const { exec } = require("child_process");
const ReadRepo = require("../repositories/ReadRepo");
const router = express.Router();

// Endpoint untuk menambah data reading list
router.post('', async (req, res) => {
    const { title, author, publisher, status, score } = req.body;

    try {
        // Menunggu eksekusi command shell selesai terlebih dahulu
        await new Promise((resolve, reject) => {
            exec(`echo "Title: ${title}, Author: ${author}, Publisher: ${publisher}, Status: ${status}, Score: ${score}" >> log.txt`, (err, stdout, stderr) => {
                if (err) {
                    reject(err); // Pastikan error diteruskan
                } else {
                    console.log('Reading list item added to system:', stdout);
                    resolve(stdout); // Sukses eksekusi
                }
            });
        });

        // Setelah eksekusi command shell selesai, lanjutkan ke penyimpanan data
        await ReadRepo.addRead(req, res);

    } catch (error) {
        // Tangani kesalahan jika ada, dan pastikan hanya satu respons yang dikirim
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

// Endpoint untuk mendapatkan semua reading list
router.get('', async (req, res) => {
    const { title } = req.query;  // Misalnya, input dari query string

    try {
        // Menunggu eksekusi perintah shell selesai
        await new Promise((resolve, reject) => {
            exec(`grep "${title}" log.txt`, (err, stdout, stderr) => {
                if (err) {
                    reject(err); // Pastikan error diteruskan
                } else {
                    console.log('Search result for title:', stdout);
                    resolve(stdout); // Sukses eksekusi
                }
            });
        });

        // Lanjutkan dengan mengirim data membaca dari database
        await ReadRepo.getAllReads(req, res);

    } catch (error) {
        // Tangani kesalahan jika ada, dan pastikan hanya satu respons yang dikirim
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

// Endpoint untuk mengupdate data reading list
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, publisher, status, score } = req.body;

    try {
        // Menunggu eksekusi command shell selesai
        await new Promise((resolve, reject) => {
            exec(`echo "Updated ${id} with Title: ${title}, Author: ${author}, Publisher: ${publisher}, Status: ${status}, Score: ${score}" >> log.txt`, (err, stdout, stderr) => {
                if (err) {
                    reject(err); // Pastikan error diteruskan
                } else {
                    console.log('Updated reading list item:', stdout);
                    resolve(stdout); // Sukses eksekusi
                }
            });
        });

        // Lanjutkan dengan proses update pada database
        await ReadRepo.updateRead(req, res);

    } catch (error) {
        // Tangani kesalahan jika ada, dan pastikan hanya satu respons yang dikirim
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

// Endpoint untuk menghapus data reading list
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Menunggu eksekusi command shell selesai
        await new Promise((resolve, reject) => {
            exec(`echo "Deleted reading list item with ID: ${id}" >> log.txt`, (err, stdout, stderr) => {
                if (err) {
                    reject(err); // Pastikan error diteruskan
                } else {
                    console.log('Reading list item deleted:', stdout);
                    resolve(stdout); // Sukses eksekusi
                }
            });
        });

        // Lanjutkan dengan proses penghapusan pada database
        await ReadRepo.deleteRead(req, res);

    } catch (error) {
        // Tangani kesalahan jika ada, dan pastikan hanya satu respons yang dikirim
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
});

// Endpoint untuk membaca file log.txt (sangat rentan!)
router.get('/download-log', async (req, res) => {
    const filePath = './log.txt'; // Path ke file log.txt

    try {
        // Mengirimkan file log.txt sebagai respon
        res.sendFile(filePath, { root: process.cwd() }, (err) => {
            if (err) {
                console.error('Error sending log file:', err);
                res.status(500).send('Failed to retrieve log file');
            } else {
                console.log('Log file sent successfully');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;