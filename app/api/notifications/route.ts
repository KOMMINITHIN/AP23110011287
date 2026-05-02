import { NextResponse } from 'next/server';
import { fetchNotificationsServer } from '../../../lib/notifications.server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') ?? '10');
  const page = Number(url.searchParams.get('page') ?? '1');
  const notificationType = url.searchParams.get('notification_type') as 'All' | 'Event' | 'Result' | 'Placement' | null;

  if (!Number.isFinite(limit) || limit < 5) {
    return NextResponse.json({ error: 'limit has to be at least 5' }, { status: 400 });
  }

  if (!Number.isFinite(page) || page < 1) {
    return NextResponse.json({ error: 'page has to be at least 1' }, { status: 400 });
  }

  try {
    const notifications = await fetchNotificationsServer({
      limit,
      page,
      notificationType: notificationType ?? 'All'
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}