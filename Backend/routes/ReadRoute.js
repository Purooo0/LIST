const express = require("express");
const ReadRepo = require("../repositories/ReadRepo");
const router = express.Router();

// Endpoint start with /reads
router.post('', ReadRepo.addRead);
router.get('', ReadRepo.getAllReads);
router.put('/:id', ReadRepo.updateRead);
router.delete('/:id', ReadRepo.deleteRead);

module.exports = router;