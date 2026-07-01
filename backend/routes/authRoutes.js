const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { signup, login, changePassword } = require("../controllers/authController");

console.log(verifyToken);
console.log(changePassword);

router.post("/signup", signup);
router.post("/login", login);
router.patch(
    "/changePassword",
    verifyToken,
    changePassword
);

module.exports = router;