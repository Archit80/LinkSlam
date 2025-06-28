# LinkSlam

> Your Ultimate Bookmarking Platform 🚀

LinkSlam is a full-stack bookmarking and link-sharing app where you can save, organize, and share useful URLs — like a digital locker meets social feed.

---

## 🔥 Features

* **Authentication**

  * Email + Password (JWT via cookies)
  * Google OAuth with Passport.js

* **Link Management**

  * Create, update, delete your links
  * Toggle visibility: Public / Private
  * Tags + NSFW flag support

* **Dashboard UI**

  * Responsive sidebar layout
  * Masonry-style cards for your links

* **Public Feed** *(coming soon)*

  * View trending links from others
  * Filter by tags, user, or popularity

---

## 🛠️ Tech Stack

| Frontend                | Backend                    |
| ----------------------- | -------------------------- |
| Next.js 14 (App Router) | Express.js                 |
| Tailwind CSS v4         | MongoDB + Mongoose         |
| Axios + Lucide Icons    | Passport.js (Google OAuth) |
| React Masonry CSS       | JWT (cookie-based auth)    |

---

## 📁 Folder Structure

```
linkslam/
├── frontend/ (Next.js App)
│   ├── app/
│   │   ├── auth/        → login, signup, google redirect
│   │   ├── my-zone/     → dashboard for user's links
│   ├── components/      → UI components (card, modal, sidebar)
│   └── services/        → API call handlers (auth + links)
├── backend/ (Express API)
│   ├── routes/          → auth, google, link endpoints
│   ├── controllers/     → logic for each route
│   ├── models/          → Mongoose schemas
│   └── config/          → passport.js, CORS, env setup
```

---

## 🧪 Running Locally

### Prerequisites

* Node.js 18+
* MongoDB (local or Atlas)

### Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Make sure to configure both `.env` files with:

* `JWT_SECRET`
* `MONGO_URI`
* `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
* `CLIENT_URL` / `SERVER_URL`

---

## 🔁 Auth Flow

```txt
[Frontend] -- login/signup --> [Backend]
              <-- Set-Cookie (JWT) --
[Frontend] -- uses cookie --> Access protected routes

For Google:
[Frontend] → /auth/google → Google Consent → /auth/google/callback
→ Sets JWT cookie → Redirects to /my-zone
```

---

## 🧠 Upcoming Ideas

* Slam Feed (global explore)
* Upvotes + reactions
* Analytics (clicks, most saved)
* Profiles & social features

---

## 👨‍💻 Built by Archit

Engineering student @ GGSIPU
Building LinkSlam to fix the chaos in your bookmarks folder 😤

⭐ Star this project if it saved your sanity!
