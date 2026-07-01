const { db, admin } = require("../config/firebase");

const checkAndSendNotifications = async () => {

    try {

        const snapshot = await db
            .collection("placement_drives")
            .get();

        const now = new Date();

        for (const doc of snapshot.docs) {

            const data = doc.data();

            if (!data.deadline) {
                continue;
            }

            const deadlineDate =
                new Date(data.deadline);

            const diffMs =
                deadlineDate - now;

            const diffDays =
                diffMs /
                (1000 * 60 * 60 * 24);

            console.log(
                `${data.company} -> ${diffDays.toFixed(2)} days left`
            );

            // 7 DAYS CHECK

            if (
                diffDays <= 7 &&
                diffDays > 3 &&
                !data.notificationsSent?.["7days"]
            ) {

                const userDoc = await db
                    .collection("users")
                    .doc(data.userId)
                    .get();

                if (!userDoc.exists) {

                    console.log(
                        `User not found for ${data.company}`
                    );

                    continue;
                }

                const userData = userDoc.data();

                if (!userData.fcmToken) {

                    console.log(
                        `No FCM token found for ${data.company}`
                    );

                    continue;
                }

                const title =
                    "📅 Application Deadline in 7 Days";

                const body =
                    `${data.company} - ${data.role} application closes soon.`;

                const response = await admin.messaging().send({

                    token: userData.fcmToken,

                    webpush: {

                        notification: {

                            title,
                            body,
                            icon: "/vite.svg"

                        }

                    }

                });;
                console.log(
                    "Firebase Response:",
                    response
                );

                await doc.ref.update({

                    "notificationsSent.7days": true

                });

                console.log(
                    `${data.company} 7-day flag updated`
                );

            }
            else if (
                diffDays <= 3 &&
                diffDays > 1 &&
                !data.notificationsSent?.["3days"]
            ) {

                const userDoc = await db
                    .collection("users")
                    .doc(data.userId)
                    .get();

                if (!userDoc.exists) continue;
                const userData = userDoc.data();
                if (!userData.fcmToken) continue;
                const title = "⚠️ Deadline Approaching";

                const body = `${data.company} - ${data.role} application closes in 3 days.`;

                const response = await admin.messaging().send({
                    token: userData.fcmToken,
                    webpush: {
                        notification: {
                            title,
                            body,
                            icon: "/vite.svg"
                        }
                    }
                });
                console.log(
                    "Firebase Response:",
                    response
                );
                await doc.ref.update({
                    "notificationsSent.3days": true
                });
                console.log(
                    `${data.company} 3-day notification sent`
                );
            }

            // 24 HOUR WINDOW

            else if (
                diffDays <= 1 &&
                diffDays > 0 &&
                !data.notificationsSent?.["24hours"]
            ) {

                const userDoc = await db
                    .collection("users")
                    .doc(data.userId)
                    .get();

                if (!userDoc.exists) continue;

                const userData = userDoc.data();

                if (!userData.fcmToken) continue;

                const title =
                    "🚨 Last Day to Apply";

                const body =
                    `${data.company} - ${data.role} application deadline is within 24 hours.`;

                const response = await admin.messaging().send({

                    token: userData.fcmToken,

                    webpush: {

                        notification: {

                            title,
                            body,
                            icon: "/vite.svg"

                        }

                    }

                });
                console.log(
                    "Firebase Response:",
                    response
                );

                await doc.ref.update({

                    "notificationsSent.24hours": true

                });

                console.log(
                    `${data.company} 24-hour notification sent`
                );

            }
        };

    }

    catch (error) {

        console.error(
            "Notification Error:",
            error
        );

    }

};

module.exports = {
    checkAndSendNotifications
};