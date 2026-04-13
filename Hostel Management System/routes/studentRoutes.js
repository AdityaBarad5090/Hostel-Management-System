const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

// Routes
router.post("/add", studentController.addStudent);
router.get("/all", studentController.getStudents);
router.put("/update/:id", studentController.updateStudent);
router.delete("/delete/:id", studentController.deleteStudent);

router.put('/update-profile/:id', studentController.updateProfile);
router.put('/change-password/:id', studentController.changePassword);

module.exports = router;
