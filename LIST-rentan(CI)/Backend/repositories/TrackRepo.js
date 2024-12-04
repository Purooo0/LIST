const Track = require("../schemas/TrackSchema");
const http = require("http");

async function addTrack(req, res) {
    const { name, days, date } = req.body;
    const track = new Track({ name, days, date });
    try {
        await track.save();
        res.status(201).json({ message: "New habit tracker successfully added", data: track });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getAllTracks(req, res) {
    try {
        const allTrackers = await Track.find();
        res.status(200).json({ message: "The entire habit tracker list was successfully obtained", data: allTrackers });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateTrack(req, res) {
    const trackerId = req.params.id;
    const { name, days, date } = req.body;
    try {
        const trackerToUpdate = await Track.findByIdAndUpdate(trackerId, { name, days, date }, { new: true });
        if (!trackerToUpdate) {
            return res.status(404).json({ error: "Habit tracker not found" });
        }
        res.status(200).json({ message: "Habit tracker updated successfully", data: trackerToUpdate });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteTrack(req, res) {
    const trackerId = req.params.id;
    try {
        const trackerToDelete = await Track.findByIdAndDelete(trackerId);
        if (!trackerToDelete) {
            return res.status(404).json({ error: "Habit tracker not found" });
        }
        res.status(200).json({ message: "Habit tracker deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getTrackSummary(req, res) {
    try {
        const summary = await Track.aggregate([
            {
                $project: {
                    name: 1,
                    checkedCount: {
                        $size: {
                            $filter: {
                                input: {
                                    $objectToArray: "$days"
                                },
                                as: "day",
                                cond: { $eq: ["$$day.v", true] }
                            }
                        }
                    }
                }
            }
        ]);
        res.status(200).json({ message: "Habit tracker summary successfully obtained", data: summary });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addTrack,
    getAllTracks,
    updateTrack,
    deleteTrack,
    getTrackSummary,
};