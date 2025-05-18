# Stanley Luong | Software Engineer Portfolio

A modern, responsive personal portfolio website built with **React** and **Tailwind CSS**, featuring live data powered by **Firebase**. Includes a secure admin dashboard for managing projects, certificates, skills, work experience, and education—all in real time.

---

## 🚀 Features

- **Modern UI/UX**: Clean, accessible, and mobile-friendly design using React and Tailwind CSS.
- **Live Data**: All portfolio content (projects, skills, certificates, etc.) is managed in Firebase Firestore.
- **Admin Dashboard**: Secure login for managing portfolio content (add, edit, delete) with instant updates.
- **No Legacy Code**: No jQuery, no legacy CSS/JS, no local JSON fallback—100% modern stack.
- **Animations**: Smooth transitions and section reveals using Framer Motion.
- **Accessibility**: High color contrast, keyboard navigation, and screen reader friendly.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend/Database**: Firebase Firestore, Firebase Auth, Firebase Storage
- **Icons**: Font Awesome React

---

## 📦 Getting Started

### 1. **Clone the repository**
```bash
git clone https://github.com/stanleyluong/stanleyluong.github.io.git
cd stanleyluong.github.io
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Configure Firebase**
- Create a Firebase project at [firebase.google.com](https://firebase.google.com/).
- In the Firebase Console, add a web app and copy your config.
- Create a `.env` file in the root with your Firebase credentials:
  ```env
  REACT_APP_FIREBASE_API_KEY=your-api-key
  REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
  REACT_APP_FIREBASE_PROJECT_ID=your-project-id
  REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
  REACT_APP_FIREBASE_APP_ID=your-app-id
  REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
  ```

### 4. **Run the app locally**
```bash
npm start
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🔒 Admin Dashboard
- Go to `/admin` (e.g., `http://localhost:3000/admin`)
- Log in with your Firebase Auth credentials (email/password)
- Manage all portfolio content in real time

---

## 🚀 Deployment
- Build for production:
  ```bash
  npm run build
  ```
- Deploy the `build/` folder to your preferred static hosting (GitHub Pages, Vercel, Netlify, Firebase Hosting, etc.)

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
MIT
