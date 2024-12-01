const Read = require("../schemas/ReadSchema");

async function addRead(req, res) {
    const { title, author, publisher, status, score } = req.body;
    const read = new Read({ title, author, publisher, status, score });
    try {
        await read.save();
        res.status(201).json({ message: "New reading list successfully added", data: read });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getAllReads(req, res) {
    try {
        const allReadingList = await Read.find();
        res.status(200).json({ message: "The entire reading list was successfully obtained", data: allReadingList });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        res.status(200).json({ message: "Reading list updated successfully", data: readingListToUpdate });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteRead(req, res) {
    const readingListId = req.params.id;
    try {
        const readingListToDelete = await Read.findByIdAndDelete(readingListId);
        if (!readingListToDelete) {
            return res.status(404).json({ error: "Reading list not found" });
        }
        res.status(200).json({ message: "Reading list deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addRead,
    getAllReads,
    updateRead,
    deleteRead,
};