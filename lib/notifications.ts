export type NotificationType = 'Event' | 'Result' | 'Placement';

export interface NotificationItem {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
}