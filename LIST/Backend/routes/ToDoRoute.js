const express = require("express");
const ToDoRepo = require("../repositories/ToDoRepo");
const router = express.Router();

// Endpoint start with /todos
router.post('', ToDoRepo.addToDo);
router.get('', ToDoRepo.getAllToDos);
router.put('/:id', ToDoRepo.updateToDo);
router.delete('/:id', ToDoRepo.deleteToDo);

module.exports = router;