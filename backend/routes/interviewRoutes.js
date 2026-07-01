const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addExperience,
    getExperiences,
    updateExperience,
    deleteExperience

} = require("../controllers/interviewController");

console.log(authMiddleware);
console.log(addExperience);
router.post(
    "/addExperience",
    authMiddleware,
    addExperience
);
router.get(
    "/getExperiences",
    authMiddleware,
    getExperiences
);
router.patch(
    "/updateExperience/:id",
    authMiddleware,     
    updateExperience
);
router.delete(          
    "/deleteExperience/:id",
    authMiddleware,
    deleteExperience
);

module.exports = router;