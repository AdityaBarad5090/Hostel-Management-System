const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

router.post("/add", feeController.addFee);
router.get("/all", feeController.getFees);
router.put("/update/:id", feeController.updateFee);
router.get("/get-fee/:id", feeController.getFeeByStudent);


module.exports = router;
    