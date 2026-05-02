# Notification System Design

## Frontend

- Stack: Next.js + TypeScript
- UI: Material UI components with vanilla CSS for global layout
- Purpose: show notification dashboards, log-triggering actions, and assignment-compliant visuals

## Logging Middleware

- Reusable `log(stack, level, package, message)` helper in `logging_middleware`
- Sends POST requests to the evaluation log API
- Validates the required values before sending

## Backend Placeholder

- `notification_app_be` is reserved for the backend layer if you need to add API routes or server logic later
- Keep backend-only code separate from the frontend app

## Expected Constraints

- Stack must be `backend` or `frontend`
- Level must be one of `debug`, `info`, `warn`, `error`, `fatal`
- Package must match the allowed list from the assignment screenshots