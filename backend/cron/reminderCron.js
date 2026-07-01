const cron = require("node-cron");

const {
    checkAndSendNotifications
} = require("../services/notificationService");

cron.schedule("* * * * *", async () => {

    console.log("Running notification cron...");

    await checkAndSendNotifications();

});