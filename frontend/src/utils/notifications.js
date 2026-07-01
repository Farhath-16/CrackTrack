import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import api from "../api/axios";

export const requestNotificationPermission = async () => {

    try {

        const permission =
            await Notification.requestPermission();

        if (permission !== "granted") {

            console.log(
                "Notification permission denied"
            );

            return;
        }

        const fcmToken =
            await getToken(
                messaging,
                {
                    vapidKey:
                        "BL2u_RgxFwat13cXWwwxRvm93kQc56XtUp7ppz5P-zc6o5Fj54xmqMT07roT6TqJPhb6qQlx1rCm5SWNmVFFOIE"
                }
            );

        if (!fcmToken) {

            console.log(
                "Failed to generate FCM Token"
            );

            return;
        }

        console.log(
            "CURRENT FCM TOKEN:",
            fcmToken
        );

        const response =
            await api.post(
                "/notifications/save-token",
                {
                    fcmToken
                }
            );

        console.log(
            response.data
        );

        console.log(
            "FCM Token saved successfully"
        );

        onMessage(
            messaging,
            (payload) => {

                console.log(
                    "NOTIFICATION RECEIVED:",
                    payload
                );
            }
        );

    }

    catch (error) {

        console.log(
            "FCM ERROR:",
            error
        );

    }

};