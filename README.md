# SolVida Clean - Professional Cleaning Services Website

Modern, responsive cleaning services website built with React, Vite, and Firebase.

## 🚀 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Email:** Resend API
- **Hosting:** 
  - Frontend: İyonos
  - Backend: Railway

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

```bash
# Start frontend dev server
npm run dev

# Start backend server
npm run server
```

## 🏗️ Build

```bash
npm run build
```

## 📝 Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend.railway.app
```

### Backend (Railway Environment Variables)
```
RESEND_API_KEY=re_your_api_key
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
```

## 🚀 Deployment

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set Root Directory: `server`
3. Set Start Command: `node index.js`
4. Add environment variables in Railway dashboard

### Frontend (İyonos)
1. Build: `npm run build`
2. Upload `dist/` folder contents to İyonos `public/` directory via SFTP

## 📞 Contact

- Website: https://solvidaclean.com
- Phone: (617) 202-1372
- Email: info@solvidaclean.com
