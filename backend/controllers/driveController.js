const { db, admin } = require("../config/firebase");

// ADD DRIVE CONTROLLER
const addDrive = async (req, res) => {

    try {

        const {
            company,
            role,
            deadline
        } = req.body;

        // ==========================
        // Required field validation
        // ==========================

        if (!company?.trim() || !role?.trim() || !deadline) {

            return res.status(400).json({
                message: "Company, role and deadline are required"
            });

        }

        // ==========================
        // Deadline validation
        // ==========================

        const deadlineDate = new Date(deadline);

        if (isNaN(deadlineDate.getTime())) {

            return res.status(400).json({
                message: "Invalid deadline format"
            });

        }

        // ==========================
        // Create structured document
        // ==========================

        const driveData = {

            company: company.trim(),

            role: role.trim(),

            deadline: deadline,

            stage: "Saved",

            result: "Not Started",

            userId: req.user.id,

            notificationsSent: {

                "7days": false,
                "3days": false,
                "24hours": false

            },

            createdAt: new Date()

        };

        const response = await db
            .collection("placement_drives")
            .add(driveData);

        res.status(201).json({

            message: "Drive added successfully",

            id: response.id

        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


const getDrives = async (req, res) => {
    try {
        const userId = req.user.id; // from auth middleware
        const snapshot = await db.collection("placement_drives").where("userId", "==", userId)
        .orderBy("deadline")
        .get();

        let drives = [];

        snapshot.forEach(doc => {
            drives.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(drives);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateDriveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !id.trim()) {
            return res.status(400).json({
                message: "Drive ID is required"
            });
        }
        const { stage, result } = req.body;

        const userId = req.user.id;

        const driveRef = db.collection("placement_drives").doc(id);
        const doc = await driveRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Drive not found" });
        }

        if (doc.data().userId !== userId) {
            return res.status(403).json({ message: "Forbidden access" });
        }

        // VALIDATION
        const allowedStages = ["Saved","Applied", "OA", "Interview", "Offer"];
        const allowedResults = ["Not Started","Pending", "Selected", "Rejected"];

        if (stage && !allowedStages.includes(stage)) {
            return res.status(400).json({ message: "Invalid stage" });
        }

        if (result && !allowedResults.includes(result)) {
            return res.status(400).json({ message: "Invalid result" });
        }

        // UPDATE DATA
        const updateData = {};
        if (stage) updateData.stage = stage;
        if (result) updateData.result = result;

        updateData.updatedAt = new Date();

        if (!stage && !result) {
            return res.status(400).json({
                message: "At least one field (stage or result) must be provided"
            });
        }
        await driveRef.update(updateData);

        res.status(200).json({
            message: "Drive updated successfully"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteDrive = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !id.trim()) {
            return res.status(400).json({
                message: "Drive ID is required"
            });
        }

        const userId = req.user.id;

        const driveRef = db.collection("placement_drives").doc(id);

        const doc = await driveRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                message: "Drive not found"
            });
        }

        // SECURITY CHECK
        if (doc.data().userId !== userId) {
            return res.status(403).json({
                message: "Forbidden access"
            });
        }

        await driveRef.delete();

        res.status(200).json({
            message: "Drive deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


module.exports = {
    addDrive,
    getDrives,
    updateDriveStatus,
    deleteDrive
};