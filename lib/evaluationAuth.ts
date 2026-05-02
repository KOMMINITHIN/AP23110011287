import 'server-only';

const AUTH_URL = 'http://20.207.122.201/evaluation-service/auth';

const AUTH_PAYLOAD = {
  email: 'nithin_kommi@srmap.edu.in',
  name: 'Nithin Kommi',
  rollNo: 'AP23110011287',
  accessCode: 'QkbpxH',
  clientID: 'ebf587fb-2162-4193-b634-e00a297effc1',
  clientSecret: 'dAXFMAJnhNYjseMT'
};

let cachedToken: string | null = null;

export async function getEvaluationAccessToken() {
  if (cachedToken) {
    return cachedToken;
  }

  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AUTH_PAYLOAD),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Auth request failed with status ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string; token_type?: string };

  if (!data.access_token) {
    throw new Error('Auth response did not include an access token');
  }

  cachedToken = data.access_token;
  return cachedToken;
}