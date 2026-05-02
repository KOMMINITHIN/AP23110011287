# Notification System Design

## Frontend

- Stack: Next.js + TypeScript
- UI: Material UI components with vanilla CSS for global layout
- Purpose: show notification dashboards, log-triggering actions, and assignment-compliant visuals

## Stage 1

- Purpose: fetch the protected notifications API, sort by priority weight, and show the top 10 items
- Priority order: `Placement` > `Result` > `Event`, then newest timestamp first within the same type
- Screenshot to capture: the terminal output from `npm run stage1`
- No client-side dashboard is needed here; keep it terminal-first and functional

## Logging Middleware

- Reusable `log(stack, level, package, message)` helper in `logging_middleware`
- Sends POST requests to the evaluation log API
- Validates the required values before sending

## Stage 2

- Route: `/`
- Purpose: responsive dashboard for filtering and browsing notifications from the protected API
- Screenshot to capture: the desktop view with filters and loaded notifications, plus a mobile-sized view

## How To Run

1. Install dependencies: `npm install`
2. Start the app: `npm run dev`
3. Run Stage 1 in the terminal: `npm run stage1`
4. Open Stage 2 at `http://localhost:3000/`
5. Take screenshots after the data loads on each route
6. If you need to clear the Next.js cache, stop the dev server first and run `npm run clean`

## Backend Placeholder

- `notification_app_be` is reserved for the backend layer if you need to add API routes or server logic later
- Keep backend-only code separate from the frontend app

## Expected Constraints

- Stack must be `backend` or `frontend`
- Level must be one of `debug`, `info`, `warn`, `error`, `fatal`
- Package must match the allowed list from the assignment screenshots