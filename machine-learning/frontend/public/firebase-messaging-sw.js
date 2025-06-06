
// ───────── firebase-messaging-sw.js ─────────

// 1) Firebase SDK 로드
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 2) Firebase 초기화
//    ─ .env 사용이 더 안전하지만, 서비스워커는 공개 영역이라 하드코딩도 무방
firebase.initializeApp({
    apiKey: 'AIzaSyDViCHRfEG3BSMWS_EiO07BXyLHlObIWU4',
    authDomain: 'c203ur.firebaseapp.com',
    projectId: 'c203ur',
    storageBucket: 'c203ur.appspot.com',          // ← 표준 형식
    messagingSenderId: '155819903771',
    appId: '1:155819903771:web:dbd75c39df45e81c0421be',
    measurementId: 'G-628W8PJZPG',
});

const messaging = firebase.messaging();

/**
 * 3) 백그라운드 메시지 수신
 *    ─ notification 필드가 포함된 메시지는 브라우저/OS가 이미 표시하므로
 *      여기서 showNotification()을 **다시 호출하지 않는다**.
 *    ─ data-only 메시지인 경우에만 직접 알림을 띄운다.
 */
messaging.onBackgroundMessage((payload) => {
    // (1) 표시형 메시지(notification)면 그대로 통과 → 중복 방지
    if (payload.notification) return;

    // (2) data-only 처리
    const { title = '알림', body = '', icon, click_action } = payload.data ?? {};

    self.registration.showNotification(title, {
        body,
        icon: icon || '/icons/icon-192x192.png', // PWA 아이콘(경로는 프로젝트에 맞게 수정)
        data: { click_action },
    });
});

/**
 * 4) 알림 클릭 시:
 *    이미 열려 있는 동일 경로 탭이 있으면 포커스,
 *    없으면 새 창/탭으로 이동.
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const target = event.notification.data?.click_action || '/';
    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (new URL(client.url).pathname === target && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) return clients.openWindow(target);
                return null;
            }),
    );
});
