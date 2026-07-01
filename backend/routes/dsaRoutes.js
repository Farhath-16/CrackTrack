const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
    addProblem,
    updateProblem,
    getProblems,
    deleteProblem
} = require("../controllers/dsaController");

router.post(
    "/addDSAProblem",
    authMiddleware,
    addProblem
);

router.patch(
    "/updateDSAProblem/:id",
    authMiddleware,
    updateProblem
);
router.get(
     
  "/getDSAProblems",
    authMiddleware,
    getProblems 
)
router.delete(
    "/deleteDSAProblem/:id",
    authMiddleware,
    deleteProblem
);
module.exports = router;