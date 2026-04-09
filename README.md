# 📸 LegacyLens

**LegacyLens** is a high-end, production-grade MERN stack application designed for capturing life's most precious moments and sealing them in digital time capsules. Inspired by Apple's minimalist design language, it offers a serene, "warm dark" environment for journaling and visual storytelling.

---

## ✨ Features

- **Apple-Inspired UI**: A premium, non-AI-generated aesthetic featuring "Warm Dark" themes, frosted glass navigation, and sophisticated Inter typography.
- **Visual Timeline**: A professional grid-based display of your memories, optimized for high-resolution photo storytelling.
- **Secure Time Capsules**: Lock memories behind a specific "unlock date" to create digital legacies that reveal themselves in the future.
- **Mood Tracking**: Categorize moments with a curated mood system, complete with subtle color-coded indicators.
- **Cloud Persistence**: Production-ready image handling using **Cloudinary** and document storage via **MongoDB Atlas**.
- **Responsive Mastery**: A full-screen side-by-side dashboard for effortless creation and viewing on any device.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS v4, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing.
- **Storage**: Cloudinary API for high-performance image serving.

---

## 🚀 Deployment

- **Frontend**: Deployed on **GitHub Pages** (Vite + GH Actions).
- **Backend API**: Hosted on **Render** (Node.js Web Service).
- **Database**: **MongoDB Atlas** (Cloud).

---

## 👨‍💻 About the Author

**Jibran** — A passionate Full-Stack Developer focused on building high-performance, aesthetically exceptional web experiences. With a focus on modern frameworks and professional UX/UI, I build products that are as functional as they are beautiful.

---

## 📝 Setup for Developers

1. Clone the repository
2. Run `npm run install-all` at the root.
3. Configure your `.env` in the `backend/` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
4. Start the development server: `npm run dev`.

---

*Built with ❤️ for lasting legacies.*
