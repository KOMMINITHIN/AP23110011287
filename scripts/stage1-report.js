const NOTIFICATIONS_API_URL = 'http://20.207.122.201/evaluation-service/notifications';
const AUTH_URL = 'http://20.207.122.201/evaluation-service/auth';
const AUTH_PAYLOAD = {
  email: 'nithin_kommi@srmap.edu.in',
  name: 'Nithin Kommi',
  rollNo: 'AP23110011287',
  accessCode: 'QkbpxH',
  clientID: 'ebf587fb-2162-4193-b634-e00a297effc1',
  clientSecret: 'dAXFMAJnhNYjseMT'
};

const priorityWeights = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function parseTimestamp(timestamp) {
  return new Date(timestamp.replace(' ', 'T')).getTime();
}

function getPriorityInbox(notifications, limit = 10) {
  return [...notifications]
    .sort((left, right) => {
      const weightDifference = priorityWeights[right.Type] - priorityWeights[left.Type];

      if (weightDifference !== 0) {
        return weightDifference;
      }

      return parseTimestamp(right.Timestamp) - parseTimestamp(left.Timestamp);
    })
    .slice(0, limit);
}

async function fetchNotifications() {
  const authResponse = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AUTH_PAYLOAD)
  });

  if (!authResponse.ok) {
    throw new Error(`Auth request failed with status ${authResponse.status}`);
  }

  const authData = await authResponse.json();

  if (!authData.access_token) {
    throw new Error('Auth response did not include an access token');
  }

  const params = new URLSearchParams({
    limit: '10',
    page: '1'
  });

  const response = await fetch(`${NOTIFICATIONS_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${authData.access_token}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Notification request failed with status ${response.status}`);
  }

  return response.json();
}

async function main() {
  const data = await fetchNotifications();

  console.log('Stage 1');
  console.log('');
  console.log('Notification API (GET)');
  console.log(NOTIFICATIONS_API_URL);
  console.log('');
  console.log('Constraints');
  console.log('  - API is a protected Route');
  console.log('');
  console.log('Response (Status Code: 200)');
  console.log(JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error('Stage 1 failed');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});