import type { NotificationItem } from './notifications';

const priorityWeights: Record<NotificationItem['Type'], number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export function getPriorityInbox(notifications: NotificationItem[], limit = 10) {
  return [...notifications]
    .sort((left, right) => {
      const weightDifference = priorityWeights[right.Type] - priorityWeights[left.Type];

      if (weightDifference !== 0) {
        return weightDifference;
      }

      return new Date(right.Timestamp.replace(' ', 'T')).getTime() - new Date(left.Timestamp.replace(' ', 'T')).getTime();
    })
    .slice(0, limit);
}