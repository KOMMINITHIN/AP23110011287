import 'server-only';

import { getEvaluationAccessToken } from './evaluationAuth';
import type { NotificationType, NotificationsResponse } from './notifications';

const NOTIFICATIONS_API_URL = 'http://20.207.122.201/evaluation-service/notifications';

export async function fetchNotificationsServer(options: {
  limit: number;
  page: number;
  notificationType?: NotificationType | 'All';
}): Promise<NotificationsResponse> {
  const authToken = await getEvaluationAccessToken();
  const params = new URLSearchParams({
    limit: String(options.limit),
    page: String(options.page)
  });

  if (options.notificationType && options.notificationType !== 'All') {
    params.set('notification_type', options.notificationType);
  }

  const response = await fetch(`${NOTIFICATIONS_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Notification request failed with status ${response.status}`);
  }

  return (await response.json()) as NotificationsResponse;
}