// src/ur-firebase/firebase-init.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig, VAPID_KEY } from "./firebase-config";

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

export const initFCM = async (): Promise<string> => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        throw new Error("알림 권한 거부됨");
    }

    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
    });

    if (!token) throw new Error("FCM 토큰 발급 실패");
    return token;
};
