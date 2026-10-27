# StudyHub: AI Study Planner

A full-stack study companion that plans your sessions, tracks your focus through the webcam, and uses a knowledge graph to recommend what to study next.

## Features

- **Study Planner**: calendar-based task scheduling with durations, completion tracking and reminders.
- **Focus Tracking**: real-time attention detection from the webcam using MediaPipe Face Mesh (eye/iris/nose landmarks). Produces a live focus score, peak focus, and distraction warnings.
- **Dashboard & Analytics**: weekly study time, focus trend, hour-by-day focus heatmap, morning vs. afternoon / weekday vs. weekend / short vs. long session comparisons.
- **Suggested Schedule**: best day/hour/topic combinations derived from past focus sessions.
- **Smart Study Recommendations**: topic suggestions and related concepts from an ArangoDB knowledge graph (GraphRAG-style), with a fallback when the graph has no match.
- **Study Groups**: UI for discovering and creating groups (currently mock data; backend routes exist but are not wired up).
- **Auth**: email/password registration and login with JWT.

## Architecture

The system is three services plus two databases:

```
                +---------------------+
                |   React frontend    |  :3000
                |  (CRA + Tailwind)   |
                +----------+----------+
                           |
          +----------------+------------------+
          |                                   |
          v                                   v
+---------------------+            +----------------------+
| Node/Express API    | :5000      | Flask analytics API  | :5001
| auth, tasks,        |            | focus sessions,      |
| reminders, graph    |            | heatmap, schedule,   |
+----------+----------+            | knowledge graph      |
           |                       +----------+-----------+
           v                                  |
   +---------------+                          v
   |   MongoDB     |                  +---------------+
   | users, tasks, |                  |   ArangoDB    |
   | reminders     |                  | topics, edges,|
   +---------------+                  | focus_sessions|
           |                          +---------------+
           +---- ArangoDB (topics / edges) ----^
```

| Concern | Service | Store |
|---|---|---|
| Users, auth, tasks, reminders | Node/Express (`Backend/`) | MongoDB |
| Topic graph, recommendations | Node/Express (`Backend/arango.js`) | ArangoDB |
| Focus sessions, analytics, schedule suggestions | Flask (`pythonbackend/`) | ArangoDB |

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Recharts, Lucide icons, Axios, `react-webcam`, MediaPipe (`face_mesh`, `camera_utils`, `drawing_utils`)
- **Backend (Node)**: Express, Mongoose, `jsonwebtoken`, `bcryptjs`, `arangojs`, `dotenv`, `cors`
- **Backend (Python)**: Flask, Flask-CORS, `python-arango`, pandas, NetworkX
- **Data**: MongoDB, ArangoDB

## Project Structure

```
.
├── Backend/                    # Node/Express API
│   ├── server.js               # App entry, Mongo + Arango setup, route mounting
│   ├── arango.js               # ArangoDB client, recommendations, related concepts
│   ├── middleware/auth.js      # Register / login / current user / JWT verification
│   ├── models/                 # Mongoose models (Task, Reminder, FocusSession)
│   └── routes/                 # tasks, reminders, graph, groups, focussTracking, sessionRoutes
├── pythonbackend/
│   └── app.py                  # Flask analytics API (focus sessions, heatmap, schedule)
├── frontend/
│   └── src/
│       ├── Pages/              # Homepage, Authpage, Dashboard, StudyPlanner,
│       │                       # FocusTracking, SmartStudy, StudyGroups, Settings, Navbar
│       ├── components/         # graphs/, cards/, StudyGroup/, Reminder
│       ├── context/            # AuthContext
│       ├── services/           # authService, GroupService, FocusTrackingService
│       └── hooks/              # useFocusTracking (camera hook)
└── Notebook-demo.ipynb         # Exploratory analysis of focus data and the knowledge graph
```

## Getting Started

### Prerequisites

- Node.js 20+ (arangojs 10 requires it)
- Python 3.10+
- MongoDB running locally (or a connection string)
- An ArangoDB instance (local or ArangoGraph cloud)

### 1. Node backend

```bash
cd Backend
npm install
cp .env.example .env   # then edit values (see below)
npm run dev            # nodemon, or: npm start
```

Runs on `http://localhost:5000`.

### 2. Flask analytics backend

```bash
cd pythonbackend
python -m venv .venv && source .venv/bin/activate
pip install flask flask-cors python-arango pandas networkx nest_asyncio
python app.py
```

Runs on `http://localhost:5001`. On first start it creates the `users`, `focus_sessions`, `study_schedules`, `goals`, `topics` collections and the `topic_relations` edge collection, and seeds sample topics.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`.

## Environment Variables

**`Backend/.env`**

| Variable | Description | Default |
|---|---|---|
| `PORT` | Express port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/authDB` |
| `JWT_SECRET` | Secret used to sign JWTs. **Set this**; the code falls back to an insecure placeholder | `your_jwt_secret` |

**`frontend/.env`**

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Node API base URL | `http://localhost:5000` |
| `REACT_APP_API_BASE_URL` | Flask analytics API base URL | `http://localhost:5001` |

> **ArangoDB credentials are currently hard-coded** in `Backend/arango.js` and `pythonbackend/app.py`. Move them to environment variables (e.g. `ARANGO_URL`, `ARANGO_USER`, `ARANGO_PASSWORD`, `ARANGO_DB`) and rotate the password before sharing or deploying. See [Known Issues](#known-issues--roadmap).

## API Overview

### Node API (`:5000`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account, returns JWT |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/user` | Yes | Current user |
| GET | `/api/tasks?date=` | Yes | Tasks due on a given day |
| POST | `/api/tasks` | Yes | Create task |
| PATCH | `/api/tasks/:id` | Yes | Toggle completion |
| DELETE | `/api/tasks/:id` | Yes | Delete an incomplete task |
| GET | `/api/tasks/recommendations` | Yes | Recommendations based on the user's task topics |
| GET | `/api/graph/related-concepts/:topic` | Yes | Related topics from the knowledge graph |
| POST | `/api/graph/recommendations` | Yes | Recommendations for a list of topics |

### Flask API (`:5001`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/focus-session` | Save a focus session |
| GET | `/api/focus-sessions/<user_id>` | List a user's focus sessions |
| GET | `/api/analyze/focus/<user_id>` | Averages, best hour, per-topic focus, PageRank of topics |
| GET | `/api/suggest/schedule/<user_id>` | Suggested weekly schedule from focus history |
| GET | `/api/visualization/focus-heatmap/<user_id>` | Day × hour focus data |
| GET/POST | `/api/schedule[/<user_id>]` | Save / fetch study schedule |
| GET/POST | `/api/goals[/<user_id>]` | Save / fetch goals |
| GET | `/api/knowledge-graph` | Topic nodes and edges |

## How Focus Tracking Works

1. The webcam stream is processed by MediaPipe Face Mesh in the browser.
2. Eye, iris and nose-tip landmarks are compared against alignment thresholds to decide whether the user is looking at the screen.
3. Every second the page adds to `totalTime`, and to `focusedTime` if focused. Focus score = `focusedTime / totalTime × 100`.
4. A warning appears when the score drops more than 20 points below the session peak.
5. On stop, the session (start/end, score, durations, topic, data points) is saved to the Flask API and feeds the dashboard, heatmap and schedule suggestions.

## Known Issues & Roadmap

These are issues found while documenting the project. They are listed here so they are visible, not hidden.

**Security (fix first)**
- ArangoDB root credentials are committed in `Backend/arango.js`, `pythonbackend/app.py`. Rotate them and load from env.
- Flask endpoints build AQL with f-strings (`FILTER doc.user_id == '{user_id}'`), which is injectable. Use bind variables (`db.aql.execute(query, bind_vars=...)`).
- Flask API has no authentication, and the user id comes from the URL, so any user's data can be read by changing it. Verify the JWT and derive the user from it.
- CORS is `origin: '*'` with `credentials: true`. Restrict to known origins.
- JWT secret falls back to `'your_jwt_secret'` when `JWT_SECRET` is unset. Fail startup instead.
- `/api/auth/forgot-password` returns a success message but sends nothing, and reveals whether an email exists.
- Reminder `PATCH` passes `req.body` straight to `findOneAndUpdate` (mass assignment).

**Correctness**
- `setupCollections()` **drops and recreates the `edges` collection on every server start**, wiping graph data. Create it only if missing.
- `server.js`: `getRecommendations` is used by `/api/edges` but never imported; `app.use('api/focuss', ...)` is missing the leading `/`; `reminderRoutes`, `groups`, and `sessionRoutes` are never mounted, so `/api/reminders` returns 404.
- `routes/reminders.js` reads `req.user.id` but the schema/model in `models/Reminder.js` lacks `date`, `sound`, `notified`, and the file defines an unused duplicate schema.
- `Task` is defined twice (`models/Task.js` and inline in `routes/tasks.js`) with different fields (`user` vs `userId`).
- `FocusSession` model fields don't match what the frontend/Flask send (`focus_score`, `topic`, etc.).
- Frontend: `Dashboard` crashes if `currentUser` is null; `Homepage` links to `/authpage` while the route is `/auth`; `/focustracking` is not wrapped in `AuthRequired`; the planner's date picker mutates state (`selectedDate.setDate`) and always renders a 7-column grid with no weekday alignment; `Reminder` `setInterval` isn't cleaned up and closes over stale state.
- `App.js` calls `navigator.serviceWorker.addEventListener` unconditionally and registers `/service-worker.js`, which isn't in the repo.
- The Flask `__main__` block is split in two, with routes defined after the first `if __name__` block; `app.run` should be at the end.

**Product gaps**
- Study Groups and Settings use hard-coded sample data; Save does nothing.
- Landing-page buttons ("Get Started", "Sign Up") have no handlers.
- Focus tracking thresholds are fixed and untested across cameras/lighting.
- No automated tests beyond the default CRA smoke test (which still looks for "learn react").

**Suggested next steps**
1. Remove secrets from the repo and git history; add `.env.example` files.
2. Put auth in front of the Flask API (shared JWT secret) and parameterise all AQL.
3. Mount the missing routes and consolidate the duplicated models.
4. Add tests for auth, task CRUD, and the focus-score calculation.
5. Replace mock data in Study Groups / Settings with real endpoints.
6. Add Docker Compose (Mongo + Arango + 3 services) for one-command setup.

## Contributing

Make small, focused commits (one concern per commit) with a message explaining the problem and the fix.

## License

Add a license of your choice (e.g. MIT) before publishing.
