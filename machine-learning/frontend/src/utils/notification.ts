export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('이 브라우저는 알림을 지원하지 않습니다.');
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        console.log('알림 권한 허용됨');
        sendNotification();
    } else {
        console.log('알림 권한 거부됨');
    }
}

export function sendNotification() {
    new Notification('테스트 알림', {
        body: 'PWA 알림이 정상 동작합니다!',
        icon: '/pwa-192x192.png',
    });
}