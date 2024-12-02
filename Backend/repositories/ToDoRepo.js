const List = require('../schemas/ToDoSchema')

async function addToDo(req, res){
    const {title, description, status, due} = req.body;
    const list = new List({title, description, status, due})
    try{
        await list.save();
        res.status(201).json({ message: "New list successfully added", data: list });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getAllToDos(req, res){
    try {
        const allList = await List.find();
        res.status(200).json({ message: "The entire list was successfully obtained", data: allList });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateToDo(req,res) {
    const listId = req.params.id;
    const { title, description, status, due } = req.body;
    try {
        const listToUpdate = await List.findByIdAndUpdate(listId, { title, description, status, due }, { new: true });
        if (!listToUpdate) {
            return res.status(404).json({ error: "List no found" });
        }
        res.status(200).json({ message: "List updated successfully", data: listToUpdate });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteToDo(req,res){
    const listId = req.params.id;
    try {
        const listToDelete = await List.findByIdAndDelete(listId);
        if (!listToDelete) {
            return res.status(404).json({ error: "List not found" });
        }
        res.status(200).json({ message: "List deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addToDo,
    getAllToDos,
    updateToDo,
    deleteToDo
}