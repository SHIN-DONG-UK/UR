import {requestNotificationPermission} from '@utils/notification';

export default function NotificationButton() {
    return (
        <button
            onClick={requestNotificationPermission}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            알림 권한 요청
        </button>
    );
}