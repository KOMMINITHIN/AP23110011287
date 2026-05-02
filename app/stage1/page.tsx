import { log } from '../../logging_middleware';
import { fetchNotificationsServer } from '../../lib/notifications.server';
import { getPriorityInbox } from '../../lib/priorityInbox';

export const dynamic = 'force-dynamic';

function formatTimestamp(timestamp: string) {
  return timestamp.replace(' ', ' · ');
}

async function safeLog(payload: Parameters<typeof log>[0]) {
  try {
    await log(payload);
  } catch {
    // Logging is best-effort for this page.
  }
}

export default async function Stage1Page() {
  let priorityInbox = [] as Awaited<ReturnType<typeof getPriorityInbox>>;
  let errorMessage = '';

  try {
    await safeLog({
      stack: 'frontend',
      level: 'info',
      package: 'page',
      message: 'stage 1 priority inbox requested'
    });

    const response = await fetchNotificationsServer({
      limit: 100,
      page: 1,
      notificationType: 'All'
    });

    priorityInbox = getPriorityInbox(response.notifications, 10);

    await safeLog({
      stack: 'frontend',
      level: 'info',
      package: 'api',
      message: `stage 1 priority inbox computed: ${priorityInbox.length} item(s)`
    });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown stage 1 error';

    await safeLog({
      stack: 'frontend',
      level: 'error',
      package: 'api',
      message: `stage 1 failed: ${errorMessage}`
    });
  }

  return (
    <main style={{ padding: '32px 20px', maxWidth: '960px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Stage 1: Priority Inbox</h1>
      <p style={{ marginTop: 0, marginBottom: '24px', lineHeight: 1.7, color: '#334155' }}>
        Notifications are ranked by type priority first: Placement, then Result, then Event. Within the same type, the newest timestamp appears first.
      </p>

      {errorMessage ? (
        <p style={{ color: '#b42318', fontWeight: 700 }}>{errorMessage}</p>
      ) : null}

      <ol style={{ paddingLeft: '20px', display: 'grid', gap: '12px' }}>
        {priorityInbox.map((notification, index) => (
          <li key={notification.ID} style={{ border: '1px solid #dbe2ea', borderRadius: '12px', padding: '16px 18px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <strong>{index + 1}. {notification.Type}</strong>
              <span style={{ color: '#64748b' }}>{formatTimestamp(notification.Timestamp)}</span>
            </div>
            <div style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{notification.Message}</div>
            <div style={{ color: '#64748b', wordBreak: 'break-all' }}>ID: {notification.ID}</div>
          </li>
        ))}
      </ol>

      {!priorityInbox.length && !errorMessage ? <p>No notifications were returned by the API.</p> : null}
    </main>
  );
}