const express = require("express");
const TrackRepo = require("../repositories/TrackRepo");
const router = express.Router();
const http = require("http");

// Endpoint start with /tracks
router.post('', TrackRepo.addTrack);
router.get('', TrackRepo.getAllTracks);
router.put('/:id', TrackRepo.updateTrack);
router.delete('/:id', TrackRepo.deleteTrack);
router.get('/summary', TrackRepo.getTrackSummary);

module.exports = router;