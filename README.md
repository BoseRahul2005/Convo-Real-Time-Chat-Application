# Convo

A full-stack MERN chat application with real-time messaging, friend requests, and contact management. Built as a portfolio project demonstrating production-grade authentication, WebSocket communication, and cloud deployment.

**Live Deployment:** Frontend on Vercel · Backend on Render

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Data Models](#data-models)
- [Socket Events](#socket-events)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Known Issues Fixed](#known-issues-fixed)
- [Roadmap](#roadmap)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React** | Core UI library — component-based architecture |
| **Vite** | Build tool & dev server (fast HMR, optimized production builds) |
| **Tailwind CSS** | Utility-first styling framework |
| **Socket.IO Client** | Real-time bidirectional communication with backend |
| **Axios** | HTTP client, configured as a singleton instance with `withCredentials: true` |
| **react-hook-form** | Form state management & validation (used in auth flows) |
| **emoji-picker-react** | Emoji picker component for the message input |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express** | Web server framework, REST API routing (`/api` routes for auth, chat, users) |
| **Socket.IO (Server)** | Real-time WebSocket layer, attached to the Express HTTP server |
| **JWT (jsonwebtoken)** | Stateless authentication, tokens stored in httpOnly cookies |
| **bcrypt** | Password hashing |
| **Mongoose** | MongoDB ODM — schema definitions for User, ChatRequest, Message |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB** | Primary data store (users, chat requests, messages) |
| **MongoDB Atlas** | Cloud-hosted database cluster |

### Email Delivery
| Technology | Purpose |
|---|---|
| **Brevo HTTP API** | Transactional email delivery (welcome emails, OTP verification/reset) — chosen over SMTP because Render's free tier blocks outbound SMTP ports (25, 465, 587) |
| ~~Nodemailer (Brevo SMTP)~~ | Initial approach, replaced due to port blocking |
| ~~Resend~~ | Evaluated, rejected — free tier sandbox restricted recipient addresses |

### Authentication & Security
| Technology | Purpose |
|---|---|
| **httpOnly Cookies** | Secure JWT storage, inaccessible to client-side JS (XSS-resistant) |
| **CORS (`credentials: true`)** | Configured on both client (axios) and server (Express) to allow cookie-based cross-origin requests |
| **Cookie flags** | `secure: true`, `sameSite: "none"` in production (required for cross-domain HTTPS cookies); relaxed in local dev |
| **OTP Verification** | Email-based one-time codes for account verification & password reset |

### Deployment & Infrastructure
| Platform | Role |
|---|---|
| **Vercel** | Frontend hosting — static build + SPA rewrite rules via `vercel.json` |
| **Render** | Backend hosting — Express + Socket.IO server (free tier: 512 MB RAM, 0.1 CPU, spins down after 15 min inactivity) |

### Environment & Config
| Tool | Purpose |
|---|---|
| **dotenv** / Vite env system | Environment variable management (`VITE_`-prefixed vars exposed to frontend build) |

---

## Features

- **Authentication** — Register, login, logout, password reset with OTP email verification
- **Friend Request System** — Send / receive / accept / reject requests, pending requests modal with incoming/sent tabs, status badges
- **Real-Time Messaging** — One-to-one conversations via Socket.IO, sender/receiver bubble styling, timestamp formatting, date separators ("Today", "Mon", "Aug 15"), auto-scroll to latest message
- **Emoji Picker** — Inline emoji selection in the message input
- **Contacts List** — Derived from accepted chat requests, shows last message + smart-formatted time, unread count badges
- **Responsive Design** — Sidebar-only view below 1000px, sidebar + chat side-by-side above 1000px; mobile-safe viewport handling (`h-dvh`, `min-h-0`, safe-area insets for notches)

---

## Architecture

- **State management:** Local component state + props-down/callbacks-up pattern; no external state library
- **Socket lifecycle:** Persistent connection opened at login, held in `useState` (not `useRef`, to ensure dependency arrays update correctly), listeners attached in `useEffect` with `.off()` cleanup
- **Utility functions:** Pure logic separated from components (`fetchContacts`, `handleSendRequest`, `formatMessageTime`, `requestHelpers.js`)
- **Immutability:** Functional state updates (`prev => ...`) throughout
- **ID handling:** Defensive comparisons (`.toString()`, `?._id ||` fallback) to handle populated vs. raw Mongoose ObjectIds

---

## Data Models

**User**
```
name, username, email, password (hashed),
isAccountVerified, resetOtp, verifyOtp, timestamps
```

**ChatRequest**
```
sender, receiver, status ("pending" | "accepted" | "rejected"),
timestamps, unique index on (sender, receiver)
```

**Message**
```
sender, receiver, text, seen (boolean), timestamps
```

---

## Socket Events

| Event | Direction | Purpose |
|---|---|---|
| `new_message` | Server → Client | Emitted when a message is sent; delivered live to the recipient |
| `chat_request_accepted` | Server → Client | Notifies the original sender their request was accepted |
| `chat_request_rejected` | Server → Client | Notifies the original sender their request was rejected |

---

## Environment Variables

**Frontend (Vercel)**
```
VITE_API_URL=
VITE_SOCKET_URL=
```

**Backend (Render)**
```
MONGO_URI=
JWT_SECRET=
NODE_ENV=production
CLIENT_URL=
BREVO_API_KEY=
```

---

## Getting Started

```bash
# Clone the repo
git clone <repo-url>

# Install dependencies (frontend & backend)
npm install
npm install

# Set up .env files (see Environment Variables above)

# Run backend
cd server && node or nodemon server.js

# Run frontend
cd client && npm run dev
```

---

## Known Issues Fixed

- CORS preflight/credentials mismatch — required `credentials: true` on both frontend axios instance and backend CORS config
- Cookie `secure`/`sameSite` behavior conditional on `NODE_ENV` — production needs both `secure: true` and `sameSite: "none"`, local dev needs `secure: false`
- Render blocking outbound SMTP ports — resolved by switching from Nodemailer/SMTP to Brevo's HTTP API
- SPA routing 404s on page refresh — fixed via `vercel.json` rewrite rules routing all paths to `index.html`
- Socket listeners not firing reliably — fixed by storing the socket instance in `useState` instead of `useRef`, so `useEffect` dependency arrays correctly detect changes

---

## Deployment Constraints (Current)

Render's free tier limits: 512 MB RAM, 0.1 CPU, spins down after 15 minutes of inactivity (~30–60s cold start on wake). Suitable for portfolio/demo use; estimated 10–30 concurrent users before performance degrades. Not recommended for unsupervised live demos without upgrading.
