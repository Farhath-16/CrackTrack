const { db,admin } = require("../config/firebase");


// ======================
// ADD DSA PROBLEM
// ======================

const addProblem = async (req, res) => {

    try {

        const {
            title,
            platform,
            topic,
            difficulty
        } = req.body;

        // Required fields validation

        if (
            !title?.trim() ||
            !platform?.trim() ||
            !topic?.trim() ||
            !difficulty?.trim()
        ) {
            return res.status(400).json({
                message: "Title, platform, topic and difficulty are required"
            });
        }

        // Clean difficulty

        const cleanDifficulty = difficulty.trim();

        // Difficulty validation

        const allowedDifficulties = [
            "Easy",
            "Medium",
            "Hard"
        ];

        if (!allowedDifficulties.includes(cleanDifficulty)) {
            return res.status(400).json({
                message: "Invalid difficulty"
            });
        }

        const problemData = {

            title: title.trim(),

            platform: platform.trim(),

            topic: topic.trim(),

            difficulty: cleanDifficulty,

            status: "Saved",

            notes: "",

            revisionCount: 0,

            nextRevisionDate: null,

            userId: req.user.id,

            createdAt: new Date(),

            updatedAt: new Date()

        };

        const response = await db
            .collection("dsa_problems")
            .add(problemData);

        res.status(201).json({

            message: "Problem added successfully",

            id: response.id

        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const updateProblem = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id?.trim()) {
            return res.status(400).json({
                message: "Problem ID is required"
            });
        }

        const {
            status,
            notes,
            revisionCount,
            nextRevisionDate
        } = req.body;

        // At least one field required

        if (
            status === undefined &&
            notes === undefined &&
            revisionCount === undefined &&
            nextRevisionDate === undefined
        ) {
            return res.status(400).json({
                message: "At least one field must be provided"
            });
        }

        const userId = req.user.id;

        const problemRef = db
            .collection("dsa_problems")
            .doc(id);

        const doc = await problemRef.get();

        if (!doc.exists) {

            return res.status(404).json({
                message: "Problem not found"
            });

        }

        // Ownership check

        if (doc.data().userId !== userId) {

            return res.status(403).json({
                message: "Forbidden access"
            });

        }

        // Status validation

        const allowedStatuses = [
            "Saved",
            "Attempted",
            "Solved",
            "Need Revision",
            "Mastered"
        ];

        const cleanStatus =
            status?.trim();

        if (
            cleanStatus &&
            !allowedStatuses.includes(cleanStatus)
        ) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        // Notes validation

        if (
            notes !== undefined &&
            notes.length > 2000
        ) {
            return res.status(400).json({
                message:
                    "Notes cannot exceed 2000 characters"
            });
        }

        // Revision count validation

        if (
            revisionCount !== undefined &&
            (
                !Number.isInteger(revisionCount) ||
                revisionCount < 0
            )
        ) {
            return res.status(400).json({
                message:
                    "Revision count must be a non-negative integer"
            });
        }

        // Revision date validation

        if (
            nextRevisionDate !== undefined &&
            nextRevisionDate !== null
        ) {

            const revisionDate =
                new Date(nextRevisionDate);

            if (
                isNaN(revisionDate.getTime())
            ) {
                return res.status(400).json({
                    message: "Invalid revision date"
                });
            }

        }

        const updateData = {};

        if (cleanStatus)
            updateData.status = cleanStatus;

        if (notes !== undefined)
            updateData.notes = notes;

        if (revisionCount !== undefined)
            updateData.revisionCount =
                revisionCount;

        if (nextRevisionDate !== undefined)
            updateData.nextRevisionDate =
                nextRevisionDate;

        updateData.updatedAt =
            new Date();

        await problemRef.update(
            updateData
        );

        res.status(200).json({
            message:
                "Problem updated successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const getProblems = async (req, res) => {

    try {

        const userId = req.user.id;

        const snapshot = await db
            .collection("dsa_problems")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        let problems = [];

        snapshot.forEach(doc => {

            const data = doc.data();

            problems.push({
                id: doc.id,
                title: data.title,
                platform: data.platform,
                topic: data.topic,
                difficulty: data.difficulty,
                status: data.status,
                notes: data.notes,
                revisionCount: data.revisionCount,
                nextRevisionDate: data.nextRevisionDate,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            });
        });
        res.status(200).json(problems);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const deleteProblem = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id?.trim()) {
            return res.status(400).json({
                message: "Problem ID is required"
            });
        }

        const userId = req.user.id;

        const problemRef = db
            .collection("dsa_problems")
            .doc(id);

        const doc = await problemRef.get();

        if (!doc.exists) {

            return res.status(404).json({
                message: "Problem not found"
            });

        }

        if (doc.data().userId !== userId) {

            return res.status(403).json({
                message: "Forbidden access"
            });

        }

        await problemRef.delete();

        res.status(200).json({
            message:
                "Problem deleted successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


module.exports = {
    addProblem,
    updateProblem,  
    getProblems,
    deleteProblem
};