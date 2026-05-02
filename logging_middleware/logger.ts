export type LogStack = 'backend' | 'frontend';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogPackage =
  | 'api'
  | 'component'
  | 'hook'
  | 'page'
  | 'state'
  | 'style'
  | 'auth'
  | 'config'
  | 'middleware'
  | 'utils';

export interface LogRequest {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

const LOG_API_URL = 'http://20.207.122.201/evaluation-service/logs';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuaXRoaW5fa29tbWlAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3Njk5Mjg0LCJpYXQiOjE3Nzc2OTgzODQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI3MWFhNTMyNS0zMjc4LTQ5YWMtOTk0Ni0zOTVkYWQyYTRlN2YiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJuaXRoaW4ga29tbWkiLCJzdWIiOiJlYmY1ODdmYi0yMTYyLTQxOTMtYjYzNC1lMDBhMjk3ZWZmYzEifSwiZW1haWwiOiJuaXRoaW5fa29tbWlAc3JtYXAuZWR1LmluIiwibmFtZSI6Im5pdGhpbiBrb21taSIsInJvbGxObyI6ImFwMjMxMTAwMTEyODciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJlYmY1ODdmYi0yMTYyLTQxOTMtYjYzNC1lMDBhMjk3ZWZmYzEiLCJjbGllbnRTZWNyZXQiOiJkQVhGTUFKbmhOWWpzZU1UIn0.Y5TQsjaasn6JRz0IecxA4D2qFKZHcPzatzsuPVslwaQ';

const allowedStacks: LogStack[] = ['backend', 'frontend'];
const allowedLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
const allowedPackages: LogPackage[] = [
  'api',
  'component',
  'hook',
  'page',
  'state',
  'style',
  'auth',
  'config',
  'middleware',
  'utils'
];

function validateLogRequest(payload: LogRequest) {
  if (!allowedStacks.includes(payload.stack)) {
    throw new Error(`Invalid stack: ${payload.stack}`);
  }

  if (!allowedLevels.includes(payload.level)) {
    throw new Error(`Invalid level: ${payload.level}`);
  }

  if (!allowedPackages.includes(payload.package)) {
    throw new Error(`Invalid package: ${payload.package}`);
  }

  if (!payload.message.trim()) {
    throw new Error('Log message cannot be empty');
  }
}

export async function log(payload: LogRequest): Promise<LogResponse> {
  validateLogRequest(payload);

  const response = await fetch(LOG_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Logging request failed with status ${response.status}`);
  }

  return (await response.json()) as LogResponse;
}