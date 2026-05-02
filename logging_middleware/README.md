# Logging Middleware

Reusable TypeScript logger for the assignment constraints.

## Supported values

- Stack: `backend`, `frontend`
- Level: `debug`, `info`, `warn`, `error`, `fatal`
- Package: `api`, `component`, `hook`, `page`, `state`, `style`, `auth`, `config`, `middleware`, `utils`

## Usage

```ts
import { log } from '../logging_middleware';

await log({
  stack: 'frontend',
  level: 'info',
  package: 'page',
  message: 'homepage loaded'
});
```