const express = require("express");
const UserRepo = require("../repositories/UserRepo");
const router = express.Router();
const http = require("http");

// Endpoint start with /users
router.post('/register', UserRepo.registerAccount);
router.post('/login', UserRepo.loginAccount);
router.post('/changePassword', UserRepo.changePassword);
router.get('/getAccount/:username', UserRepo.getAccount);


module.exports = router;