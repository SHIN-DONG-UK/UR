import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initFCM, messaging } from './ur-firebase/firebase-init';
import { onMessage } from 'firebase/messaging';

const queryClient = new QueryClient();

// 1) 서비스 워커 등록 + 2) 토큰 요청 + 3) 포그라운드 메시지
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('SW 등록 완료', reg);

            const token = await initFCM();           // 토큰 발급 및 서버 저장
            console.log('FCM 토큰:', token);

            onMessage(messaging, payload => {
                console.log('Foreground message:', payload);
                new Notification(payload.notification?.title ?? '알림', {
                    body: payload.notification?.body,
                });
            });
        } catch (err) {
            console.error('FCM 초기화 실패:', err);
        }
    });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);
