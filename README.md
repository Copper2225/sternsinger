## Sternsinger Dashboard

Full-stack application with a React + TypeScript + Vite frontend and a Node.js + Express backend. The app displays live collection progress and admin tools for managing districts and totals.

### Monorepo layout

- `frontend`: Vite React app (TypeScript)
- `backend`: Node.js/Express server (WS + REST)

### Requirements

- Node.js 18+

### Quick start

```bash
# install deps for workspace
npm install

# start frontend and backend together
npm run dev

# build frontend
npm run build

# start both services in production-like mode
npm start
```

Frontend will run on `http://localhost:5173` (or Vite's port). Backend runs on `http://localhost:3000` unless overridden by environment variables.

### Frontend

- React 18, Vite 5, TypeScript
- Styling with Bootstrap and styled-components
- State with Recoil
- Routing with React Router

Common scripts (run from repo root or `-w frontend`):

```bash
npm run dev -w frontend      # Vite dev server
npm run build -w frontend    # Build to dist/
npm run preview -w frontend  # Preview built app
```

### Backend

- Express server with WebSocket support

Scripts:

```bash
npm run dev -w backend   # Start server in dev
npm run start -w backend # Start server
```

### Configuration

Backend reads environment variables from `.env` if present. Typical values:

```
PORT=3000
ORIGIN=http://localhost:5173
```

### Development tips

- Use `npm run dev` at the root to run both services concurrently.
- API base URLs: the frontend expects the backend at the same host/port configured via environment or proxy.

### License

This project is licensed under the MIT License. See `LICENSE` for details.
