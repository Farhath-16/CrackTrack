const { db, admin } = require("../config/firebase");

const saveFCMToken = async (req, res) => {
    try {

        const { fcmToken } = req.body;

        if (!fcmToken) {
            return res.status(400).json({
                message: "FCM token is required"
            });
        }

        const userId = req.user.id;

        await db.collection("users")
            .doc(userId)
            .update({
                fcmToken
            });

        res.status(200).json({
            message: "FCM token saved successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    saveFCMToken
};