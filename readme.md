# Sketchr.

### Real-time Collaborative Whiteboarding — Reimagined.

Create a Room. Share the Link. Collaborate Instantly.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [API Reference](#-api-reference)
- [WebSocket Events](#-websocket-events)
- [Database Models](#-database-models)
- [Frontend Routes](#-frontend-routes)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**Sketchr** is a full-stack, real-time collaborative whiteboarding application that enables teams to draw, plan, and brainstorm together on an infinite canvas. Built with a **neobrutalism / bento-style UI**, it delivers a premium design language with bold borders, playful shadows, and vibrant accent colors.

The platform supports **live multi-user drawing** via WebSockets, **in-room chat**, **peer-to-peer video calls** via WebRTC, **AI-powered flowchart generation** using Google Gemini, and **board persistence** with auto-save to MongoDB. Every interaction — from pen strokes to sticky notes — is synchronized across all participants at 60fps with zero-latency local rendering.

---

## 🌐 Live Demo

```
https://sketchr.yourdomain.com
```

---

## ✨ Key Features

### 🎨 Canvas & Drawing

- **Freehand Drawing** — Pressure-sensitive strokes powered by `perfect-freehand`
- **Shape Tools** — Rectangles, circles, and arrows with snap-to-grid
- **Sticky Notes** — Draggable, colorful sticky notes for brainstorming
- **Text Tool** — Add text labels anywhere on the canvas
- **Eraser** — Clean up strokes with a dedicated eraser tool
- **Undo / Redo** — Full history stack with `Ctrl+Z` / `Ctrl+Y` shortcuts
- **Zoom & Pan** — Smooth infinite canvas navigation with hand tool
- **Color Palette** — 9 preset colors with 4 stroke width options
- **Dark / Light Canvas Theme** — Toggle canvas background theme in settings

### 🤝 Real-Time Collaboration

- **Live Cursors** — See every participant's cursor position with colored indicators
- **Synchronized State** — All drawing actions broadcast via Socket.IO in real-time
- **In-Memory Caching** — Room state cached on the server using `Map` for instant sync
- **Auto-Save** — Debounced writes to MongoDB every 5 seconds during active sessions
- **Graceful Disconnect** — 30-second cache retention on page refresh / reconnect
- **User Avatars** — Dynamic avatar stack showing active collaborators
- **Access Control** — Private boards with knock-to-enter request system

### 💬 Communication

- **Room Chat** — Persistent in-room messaging with real-time delivery
- **Video Calls** — Peer-to-peer video/audio via WebRTC (PeerJS)
- **Screen Sharing** — Share your screen directly into the video huddle
- **Mute / Camera Toggle** — Full media controls within the call UI

### 🤖 AI Generation

- **Text-to-Canvas** — Describe a flowchart, mindmap, or architecture diagram in natural language
- **Gemini 3 Flash** — Powered by Google's Gemini API for instant structured output
- **Encrypted API Keys** — User API keys encrypted at rest using AES-256-GCM
- **Shimmer Loading** — Beautiful loading state while AI generates content

### 📦 Board Management

- **Dashboard** — Clean brutalist dashboard with recent boards grid
- **My Boards** — Filter by "All" or "Shared" boards with create/delete functionality
- **Template Gallery** — Pre-built board templates for common workflows
- **Export** — Download boards as PNG, JPEG, or `.sketchr` JSON files
- **Room Expiration** — Automatic TTL (24h) with cron-based session cleanup

### 🔒 Authentication & Security

- **JWT Authentication** — Stateless token-based auth with protected routes
- **Password Hashing** — bcrypt with 10 salt rounds
- **Helmet** — HTTP security headers on all responses
- **CORS** — Strict origin-based cross-origin policy
- **Zod Validation** — Schema-based request validation middleware
- **Rate Limiting** — Express rate limiter on sensitive endpoints

### 📱 Responsive Design

- **Mobile-First** — Full responsive overhaul with `max-md:` breakpoints
- **Bottom Navigation** — Mobile tab bar for dashboard navigation
- **Touch-Friendly** — Optimized tool sizes and spacing for touch devices

---

## 🛠 Tech Stack

### Frontend

| Technology           | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| **React 19**         | UI framework with functional components & hooks   |
| **Vite 7**           | Lightning-fast build tool & dev server            |
| **Tailwind CSS 4**   | Utility-first CSS with neobrutalism custom design |
| **Zustand 5**        | Lightweight global state management               |
| **Socket.IO Client** | Real-time bidirectional WebSocket communication   |
| **Framer Motion**    | Declarative animations & page transitions         |
| **GSAP**             | High-performance entrance & scroll animations     |
| **PeerJS**           | WebRTC abstraction for video calls                |
| **Perfect Freehand** | Pressure-sensitive freehand stroke rendering      |
| **Axios**            | HTTP client with JWT interceptors                 |
| **React Router v7**  | Client-side routing with nested layouts           |
| **html-to-image**    | Canvas export to PNG/JPEG                         |
| **Lucide React**     | Icon library                                      |
| **Radix UI**         | Accessible headless UI primitives                 |
| **Shadcn/UI**        | Pre-styled component library                      |

### Backend

| Technology               | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| **Node.js**              | JavaScript runtime                        |
| **Express 4**            | RESTful API framework                     |
| **MongoDB + Mongoose 8** | NoSQL database with ODM                   |
| **Socket.IO 4**          | Real-time WebSocket server                |
| **JWT (jsonwebtoken)**   | Stateless authentication tokens           |
| **bcrypt**               | Password hashing                          |
| **Zod 4**                | Request schema validation                 |
| **Helmet**               | Security HTTP headers                     |
| **CORS**                 | Cross-Origin Resource Sharing             |
| **node-cron**            | Scheduled task runner for room expiration |
| **dotenv**               | Environment variable management           |
| **Nodemon**              | Hot-reload dev server                     |

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                       │
│                                                               │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Landing  │  │   Auth    │  │Dashboard │  │  Workspace  │  │
│  │  Page    │  │Login/Sign │  │  Boards  │  │   (Room)    │  │
│  └──────────┘  └───────────┘  │Templates │  │  Canvas     │  │
│                                │ Settings │  │  Chat       │  │
│                                └──────────┘  │  Video Call │  │
│                                               │  AI Modal   │  │
│                                               └────────────┘  │
│                                                               │
│  Services: api.js (Axios) ←→ socket.js (Socket.IO)          │
│  State: authStore.js (Zustand) | boardStore.js               │
└──────────────┬──────────────────────┬────────────────────────┘
               │ REST API (HTTP)      │ WebSockets
               │ /api/*               │ Socket.IO
               ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER (Node.js)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                    Express App                        │    │
│  │  Middleware: Helmet │ CORS │ Auth │ Validate │ Rate   │    │
│  │                                                       │    │
│  │  Routes:                                              │    │
│  │    /api/auth       → Register, Login                  │    │
│  │    /api/users      → Profile, API Key                 │    │
│  │    /api/rooms      → CRUD Rooms                       │    │
│  │    /api/whiteboard → Save/Load Canvas                 │    │
│  │    /api/chat       → Message History                  │    │
│  │    /api/ai         → Gemini Flowchart Generation      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                 Socket Manager                        │    │
│  │  Events: join_room │ cursor_move │ add_element        │    │
│  │          update_element │ delete_element │ chat        │    │
│  │          video_ready │ request_join │ resolve_join     │    │
│  │                                                       │    │
│  │  In-Memory Cache: Map<roomId, Map<elementId, Element>>│    │
│  │  Auto-Save: Debounced 5s writes to MongoDB            │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Cron Jobs (node-cron)                     │    │
│  │  Every minute: Check & expire rooms past duration     │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Atlas                           │
│                                                               │
│  Collections:                                                 │
│    • users        — Auth, profile, encrypted API keys        │
│    • rooms        — Board metadata, participants, TTL        │
│    • whiteboards  — Canvas elements (strokes, nodes, etc.)   │
│    • chats        — Room chat message history                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Sketchr/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js                  # HTTP server bootstrap
│       ├── app.js                     # Express app configuration
│       ├── config/
│       │   └── db.js                  # MongoDB connection
│       ├── middleware/
│       │   ├── auth.middleware.js      # JWT verification
│       │   ├── usage.middleware.js     # Usage/rate tracking
│       │   └── validate.middleware.js  # Zod schema validation
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── auth.model.js      # User schema (bcrypt, encrypted keys)
│       │   │   ├── auth.controller.js # Register, Login
│       │   │   └── auth.routes.js
│       │   ├── users/
│       │   │   ├── users.controller.js # Profile, API key management
│       │   │   └── users.routes.js
│       │   ├── rooms/
│       │   │   ├── rooms.model.js     # Room schema (TTL, participants)
│       │   │   ├── rooms.controller.js # CRUD operations
│       │   │   └── rooms.routes.js
│       │   ├── whiteboard/
│       │   │   ├── whiteboard.model.js # Canvas elements schema
│       │   │   ├── whiteboard.controller.js
│       │   │   └── whiteboard.routes.js
│       │   ├── chat/
│       │   │   ├── chat.model.js      # Message schema
│       │   │   ├── chat.controller.js
│       │   │   └── chat.routes.js
│       │   └── ai/
│       │       ├── ai.controller.js   # Gemini API integration
│       │       └── ai.routes.js
│       ├── sockets/
│       │   └── socketManager.js       # Socket.IO event handling & caching
│       └── utils/
│           ├── cron.util.js           # Room expiration scheduler
│           └── crypto.util.js         # AES-256-GCM encryption
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx                   # App entry point
│       ├── App.jsx                    # Router & route guards
│       ├── index.css                  # Global styles & Tailwind
│       ├── assets/                    # PNG icons & SVG assets
│       ├── components/
│       │   ├── Auth.jsx               # Login / Register form
│       │   ├── landing/               # Landing page sections
│       │   │   ├── Navbar.jsx
│       │   │   ├── Hero.jsx
│       │   │   ├── Features.jsx
│       │   │   ├── Problem.jsx
│       │   │   ├── Solution.jsx
│       │   │   ├── UseCases.jsx
│       │   │   ├── HowItWorks.jsx
│       │   │   ├── Architecture.jsx
│       │   │   ├── Pricing.jsx
│       │   │   ├── Deployment.jsx
│       │   │   ├── FinalCTA.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── components/
│       │   │       └── DraggableStickyNotes.jsx
│       │   └── ui/                    # Shadcn/Radix components
│       │       ├── button.jsx
│       │       └── github.jsx
│       ├── pages/
│       │   ├── Landing.jsx            # Landing page layout
│       │   ├── Dashboard/
│       │   │   ├── Dashboard.jsx      # Dashboard layout + mobile nav
│       │   │   ├── RoomList.jsx       # Active rooms list
│       │   │   └── components/
│       │   │       ├── Content.jsx    # Recent boards grid
│       │   │       ├── MyBoards.jsx   # All boards with filter
│       │   │       ├── Templates.jsx  # Template gallery
│       │   │       ├── Settings.jsx   # Profile, theme, AI config
│       │   │       ├── Sidebar.jsx    # Desktop sidebar nav
│       │   │       ├── Topbar.jsx     # Top header bar
│       │   │       └── Upgrade.jsx    # Pro plan page
│       │   └── Workspace/
│       │       ├── Room.jsx           # Main canvas & collaboration room
│       │       └── UIComponents.jsx   # Toolbar, panels, modals
│       ├── services/
│       │   ├── api.js                 # Axios instance + JWT interceptor
│       │   ├── socket.js             # Socket.IO client singleton
│       │   └── webrtc.js             # WebRTC / PeerJS service
│       ├── store/
│       │   ├── authStore.js           # Zustand auth state
│       │   └── boardStore.js          # Zustand board state
│       ├── hooks/
│       │   ├── core/
│       │   │   ├── useAuth.js
│       │   │   └── useTheme.js
│       │   ├── domain/
│       │   │   ├── useUsageLimits.js
│       │   │   └── useWhiteboardState.js
│       │   └── network/
│       │       ├── useSocket.js
│       │       └── useWebRTC.js
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ThemeContext.jsx
│       └── lib/
│           └── utils.js               # Tailwind merge utility
│
└── readme.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool        | Version                         |
| ----------- | ------------------------------- |
| **Node.js** | v20+                            |
| **npm**     | v10+                            |
| **MongoDB** | Atlas (cloud) or local instance |
| **Git**     | Latest                          |

### Environment Variables

#### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sketchr?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Encryption (32-byte hex key for AES-256-GCM)
ENCRYPTION_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
```

#### Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

> **Generating an encryption key:**
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Installation

```bash
# Clone the repository
git clone https://github.com/prithvikings/sketchr.git
cd sketchr

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

Open **two terminals**:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

> Starts the Express + Socket.IO server on `http://localhost:3000`

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

> Starts the Vite dev server on `http://localhost:5173`

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Endpoint             | Auth | Description          |
| ------ | -------------------- | ---- | -------------------- |
| `POST` | `/api/auth/register` | ❌   | Create a new account |
| `POST` | `/api/auth/login`    | ❌   | Login & receive JWT  |

**Register Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Users

| Method   | Endpoint             | Auth | Description                   |
| -------- | -------------------- | ---- | ----------------------------- |
| `PUT`    | `/api/users/profile` | ✅   | Update profile (fullName)     |
| `POST`   | `/api/users/api-key` | ✅   | Save encrypted Gemini API key |
| `DELETE` | `/api/users/account` | ✅   | Delete user account & data    |

### Rooms

| Method   | Endpoint         | Auth | Description               |
| -------- | ---------------- | ---- | ------------------------- |
| `POST`   | `/api/rooms`     | ✅   | Create a new room         |
| `GET`    | `/api/rooms`     | ✅   | Get all rooms for user    |
| `GET`    | `/api/rooms/:id` | ✅   | Get room details by ID    |
| `DELETE` | `/api/rooms/:id` | ✅   | Delete a room (host only) |

**Create Room Request Body:**

```json
{
  "name": "Sprint Planning Q1",
  "maxParticipants": 10
}
```

### Whiteboard

| Method | Endpoint                  | Auth | Description             |
| ------ | ------------------------- | ---- | ----------------------- |
| `GET`  | `/api/whiteboard/:roomId` | ✅   | Load saved canvas state |
| `POST` | `/api/whiteboard/:roomId` | ✅   | Save canvas elements    |

### Chat

| Method | Endpoint            | Auth | Description                 |
| ------ | ------------------- | ---- | --------------------------- |
| `GET`  | `/api/chat/:roomId` | ✅   | Get chat history for a room |
| `POST` | `/api/chat/:roomId` | ✅   | Send a new chat message     |

### AI

| Method | Endpoint            | Auth | Description                    |
| ------ | ------------------- | ---- | ------------------------------ |
| `POST` | `/api/ai/flowchart` | ✅   | Generate flowchart from prompt |

**AI Request Body:**

```json
{
  "prompt": "A user authentication flow with login, register, and password reset"
}
```

**AI Response:**

```json
{
  "nodes": [
    { "id": "1", "type": "start", "label": "User Arrives" },
    { "id": "2", "type": "decision", "label": "Has Account?" },
    { "id": "3", "type": "process", "label": "Login" },
    { "id": "4", "type": "process", "label": "Register" }
  ],
  "connectors": [
    { "sourceId": "1", "targetId": "2" },
    { "sourceId": "2", "targetId": "3" },
    { "sourceId": "2", "targetId": "4" }
  ]
}
```

### Health Check

| Method | Endpoint  | Auth | Description          |
| ------ | --------- | ---- | -------------------- |
| `GET`  | `/health` | ❌   | Server health status |

---

## 🔌 WebSocket Events

All Socket.IO events are **authenticated** via JWT in the handshake.

### Client → Server

| Event                  | Payload                          | Description                        |
| ---------------------- | -------------------------------- | ---------------------------------- |
| `join_room`            | `{ roomId }`                     | Join a collaborative room          |
| `leave_room`           | `{ roomId }`                     | Leave the room                     |
| `cursor_move`          | `{ roomId, cursor }`             | Broadcast cursor position          |
| `add_element`          | `{ roomId, element }`            | Add a new canvas element           |
| `update_element`       | `{ roomId, elementId, updates }` | Update an existing element         |
| `delete_element`       | `{ roomId, elementId }`          | Delete an element                  |
| `send_message`         | `{ roomId, message }`            | Send a chat message                |
| `video_ready`          | `{ roomId, peerId }`             | Notify peers of video availability |
| `request_join`         | `{ roomId, user }`               | Request to join a private room     |
| `resolve_join_request` | `{ guestSocketId, status }`      | Host approves/denies join request  |

### Server → Client

| Event                   | Payload                        | Description                    |
| ----------------------- | ------------------------------ | ------------------------------ |
| `initial_state`         | `Element[]`                    | Full canvas state on join      |
| `user_joined`           | `{ socketId, userId }`         | New user joined notification   |
| `user_left`             | `{ socketId, userId }`         | User disconnected notification |
| `cursor_move`           | `{ socketId, cursor }`         | Peer cursor update             |
| `add_element`           | `Element`                      | New element from peer          |
| `update_element`        | `{ elementId, updates }`       | Element update from peer       |
| `delete_element`        | `{ elementId }`                | Element deletion from peer     |
| `receive_message`       | `Message`                      | Incoming chat message          |
| `user_video_ready`      | `{ peerId }`                   | Peer ready for video call      |
| `incoming_join_request` | `{ guestSocketId, guestUser }` | Someone wants to join          |
| `join_request_resolved` | `{ status }`                   | Host's join decision           |
| `room_expired`          | `{ message }`                  | Room session timed out         |

---

## 🗄 Database Models

### User

```javascript
{
  fullName:        String (required),
  email:           String (required, unique, indexed),
  passwordHash:    String (bcrypt hashed),
  encryptedApiKey: String (AES-256-GCM encrypted),
  iv:              String (initialization vector),
  role:            "free" | "pro",
  createdAt:       Date,
  updatedAt:       Date
}
```

### Room

```javascript
{
  name:                 String (default: "Untitled Board"),
  hostId:               ObjectId → User (required),
  participants:         [ObjectId → User],
  maxParticipants:      Number (default: 10),
  sessionDurationLimit: Number (default: 60 minutes),
  status:               "active" | "expired",
  createdAt:            Date (TTL: 24 hours)
}
```

### Whiteboard

```javascript
{
  roomId:      ObjectId → Room (required, indexed),
  elements:    [{
    id:        String,
    type:      "stroke" | "node" | "connector" | "sticky" | "text",
    position:  Object,
    content:   Mixed,
    metadata:  Mixed
  }],
  lastUpdated: Date
}
```

### Chat

```javascript
{
  roomId:    ObjectId → Room (required, indexed),
  senderId:  ObjectId → User (required),
  message:   String (max: 1000 chars),
  timestamp: Date
}
```

---

## 🗺 Frontend Routes

| Path                   | Component               | Auth | Description                                  |
| ---------------------- | ----------------------- | ---- | -------------------------------------------- |
| `/`                    | `Landing`               | ❌   | Marketing landing page                       |
| `/auth`                | `Auth`                  | ❌\* | Login / Register (\* redirects if logged in) |
| `/dashboard`           | `Dashboard > Content`   | ✅   | Recent boards overview                       |
| `/dashboard/boards`    | `Dashboard > MyBoards`  | ✅   | All boards with filter                       |
| `/dashboard/templates` | `Dashboard > Templates` | ✅   | Template gallery                             |
| `/dashboard/settings`  | `Dashboard > Settings`  | ✅   | Profile, theme, API key                      |
| `/dashboard/upgrade`   | `Dashboard > Upgrade`   | ✅   | Pro plan information                         |
| `/room/:roomId`        | `Room`                  | ✅   | Collaborative whiteboard workspace           |
| `*`                    | 404 Page                | —    | Catch-all fallback                           |

---

## 🖼 Screenshots

> Add screenshots of your application here. Recommended sections:
>
> - Landing Page
> - Dashboard
> - Workspace / Room (with collaboration)
> - AI Generation Modal
> - Video Call Huddle
> - Mobile Responsive Views

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention

| Prefix      | Usage                     |
| ----------- | ------------------------- |
| `feat:`     | New feature               |
| `fix:`      | Bug fix                   |
| `docs:`     | Documentation changes     |
| `style:`    | UI/CSS changes (no logic) |
| `refactor:` | Code restructuring        |
| `chore:`    | Tooling, deps, configs    |

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [prithvikings](https://github.com/prithvikings)**

⭐ Star this repo if you found it useful!

</div>
