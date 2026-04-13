const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.post("/add", roomController.addRoom);
router.get("/all", roomController.getRooms);
router.put("/update/:id", roomController.updateRoom);
router.delete("/delete/:id", roomController.deleteRoom);
router.get('/student-room/:id', roomController.getStudentRoom);

module.exports = router;
