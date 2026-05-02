import { getEvaluationAccessToken } from '../lib/evaluationAuth';

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
  const authToken = await getEvaluationAccessToken();

  const response = await fetch(LOG_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Logging request failed with status ${response.status}`);
  }

  return (await response.json()) as LogResponse;
}