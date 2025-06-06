// src/ur-firebase/messaging.ts
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase-init";

onMessage(messaging, (payload) => {
    const { title, body } = payload.notification || {};
    if (title && body) {
        new Notification(title, { body });
    }
});
