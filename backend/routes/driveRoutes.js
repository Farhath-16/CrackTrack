const express=require('express');

const router=express.Router();

const { addDrive, getDrives, updateDriveStatus, deleteDrive } = require("../controllers/driveController");

const verifyToken = require("../middleware/authMiddleware");

// POST /addDrive
router.post("/addDrive", verifyToken, addDrive);
router.get("/getDrives", verifyToken, getDrives);
router.patch("/updateDriveStatus/:id", verifyToken, updateDriveStatus);
router.delete("/deleteDrive/:id", verifyToken, deleteDrive);

module.exports = router;