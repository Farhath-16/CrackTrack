const { db,admin } = require("../config/firebase");

// ======================
// ADD INTERVIEW EXPERIENCE
// ======================

const addExperience = async (req, res) => {

    try {

        const {
            company,
            role,
            rounds,
            experience,
            result,
            tags
        } = req.body;

        // ======================
        // Required Fields
        // ======================

        if (
            !company?.trim() ||
            !role?.trim() ||
            !experience?.trim()
        ) {

            return res.status(400).json({
                message: "Company, role and experience are required"
            });

        }

        // ======================
        // Rounds Validation
        // ======================

        if (
            rounds === undefined ||
            !Number.isInteger(rounds) ||
            rounds <= 0
        ) {

            return res.status(400).json({
                message: "Rounds must be a positive integer"
            });

        }

        // ======================
        // Result Validation
        // ======================

        const allowedResults = [
            "Pending",
            "Selected",
            "Rejected"
        ];

        const cleanResult =
            result?.trim() || "Pending";

        if (
            !allowedResults.includes(cleanResult)
        ) {

            return res.status(400).json({
                message: "Invalid result"
            });

        }

        // ======================
        // Experience Length
        // ======================

        if (
            experience.length > 5000
        ) {

            return res.status(400).json({
                message:
                    "Experience cannot exceed 5000 characters"
            });

        }

        // ======================
        // Tags Validation
        // ======================

        const cleanTags =
            Array.isArray(tags)
                ? tags.map(tag => tag.trim())
                : [];

        const interviewData = {

            company: company.trim(),

            role: role.trim(),

            rounds,

            experience: experience.trim(),

            result: cleanResult,

            tags: cleanTags,

            userId: req.user.id,

            createdAt: new Date(),

            updatedAt: new Date()

        };

        const response = await db
            .collection("interview_experiences")
            .add(interviewData);

        res.status(201).json({

            message:
                "Interview experience added successfully",

            id: response.id

        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


const getExperiences = async (req, res) => {

    try {

        const userId = req.user.id;

        const snapshot = await db
            .collection("interview_experiences")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        let experiences = [];

        snapshot.forEach(doc => {

            const data = doc.data();

            experiences.push({

                id: doc.id,

                company: data.company,

                role: data.role,

                rounds: data.rounds,

                experience: data.experience,

                result: data.result,

                tags: data.tags,

                createdAt: data.createdAt,

                updatedAt: data.updatedAt

            });

        });

        res.status(200).json(experiences);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const updateExperience = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id?.trim()) {

            return res.status(400).json({
                message: "Experience ID is required"
            });

        }

        const {
            company,
            role,
            rounds,
            experience,
            result,
            tags
        } = req.body;

        // At least one field required

        if (
            company === undefined &&
            role === undefined &&
            rounds === undefined &&
            experience === undefined &&
            result === undefined &&
            tags === undefined
        ) {

            return res.status(400).json({
                message: "At least one field must be provided"
            });

        }

        const userId = req.user.id;

        const experienceRef = db
            .collection("interview_experiences")
            .doc(id);

        const doc = await experienceRef.get();

        // Experience exists?

        if (!doc.exists) {

            return res.status(404).json({
                message: "Interview experience not found"
            });

        }

        // Ownership check

        if (doc.data().userId !== userId) {

            return res.status(403).json({
                message: "Forbidden access"
            });

        }

        const updateData = {};

        // Company validation

        if (company !== undefined) {

            if (!company.trim()) {

                return res.status(400).json({
                    message: "Company cannot be empty"
                });

            }

            updateData.company =
                company.trim();

        }

        // Role validation

        if (role !== undefined) {

            if (!role.trim()) {

                return res.status(400).json({
                    message: "Role cannot be empty"
                });

            }

            updateData.role =
                role.trim();

        }

        // Rounds validation

        if (rounds !== undefined) {

            if (
                !Number.isInteger(rounds) ||
                rounds <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Rounds must be a positive integer"
                });

            }

            updateData.rounds = rounds;

        }

        // Experience validation

        if (experience !== undefined) {

            if (!experience.trim()) {

                return res.status(400).json({
                    message:
                        "Experience cannot be empty"
                });

            }

            if (experience.length > 5000) {

                return res.status(400).json({
                    message:
                        "Experience cannot exceed 5000 characters"
                });

            }

            updateData.experience =
                experience.trim();

        }

        // Result validation

        if (result !== undefined) {

            const allowedResults = [
                "Pending",
                "Selected",
                "Rejected"
            ];

            const cleanResult =
                result.trim();

            if (
                !allowedResults.includes(cleanResult)
            ) {

                return res.status(400).json({
                    message: "Invalid result"
                });

            }

            updateData.result =
                cleanResult;

        }

        // Tags validation

        if (tags !== undefined) {

            if (!Array.isArray(tags)) {

                return res.status(400).json({
                    message:
                        "Tags must be an array"
                });

            }

            updateData.tags =
                tags.map(tag => tag.trim());

        }

        updateData.updatedAt =
            new Date();

        await experienceRef.update(
            updateData
        );

        res.status(200).json({
            message:
                "Interview experience updated successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


const deleteExperience = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id?.trim()) {

            return res.status(400).json({
                message: "Experience ID is required"
            });

        }

        const userId = req.user.id;

        const experienceRef = db
            .collection("interview_experiences")
            .doc(id);

        const doc = await experienceRef.get();

        // Exists?

        if (!doc.exists) {

            return res.status(404).json({
                message:
                    "Interview experience not found"
            });

        }

        // Ownership check

        if (doc.data().userId !== userId) {

            return res.status(403).json({
                message: "Forbidden access"
            });

        }

        await experienceRef.delete();

        res.status(200).json({
            message:
                "Interview experience deleted successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
module.exports = {
    addExperience,
    getExperiences,
    updateExperience,
    deleteExperience
};