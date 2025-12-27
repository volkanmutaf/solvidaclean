# ⚡ Railway Hızlı Deployment

## 🚀 Adım 1: GitHub Repo Oluştur ve Push Et

### 1. GitHub'da Yeni Repo
1. https://github.com → **New repository**
2. Repo adı: `solvidaclean`
3. **Create repository**

### 2. Local'den Push Et

PowerShell'de:
```powershell
cd D:\Users\Vol\Desktop\BC\binoclean

# Remote ekle (YOUR_USERNAME'i değiştirin)
git remote add origin https://github.com/YOUR_USERNAME/solvidaclean.git

# Push et
git branch -M main
git push -u origin main
```

## 🚂 Adım 2: Railway'a Deploy

### 1. Railway'a Kaydol
- https://railway.app
- **"Start a New Project"**
- **"Deploy from GitHub repo"**
- GitHub ile giriş yap

### 2. Repo Seç
- **"solvidaclean"** repo'sunu seç
- **"Deploy Now"**

### 3. Ayarlar
**Settings** sekmesinde:
- **Root Directory:** `server`
- **Start Command:** `node index.js`

### 4. Environment Variables
**Variables** sekmesinde ekle:
```
RESEND_API_KEY=re_H1WGZDH9_EoaZfh1PGWkBwJfWcHW1t4u6
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
```

### 5. Domain Al
- **Settings** → **Domains** → **Generate Domain**
- URL'i kopyala: `https://your-app.railway.app`

## 📦 Adım 3: Frontend'i Güncelle

### 1. API URL'i Güncelle
`.env.production` dosyasına ekle:
```env
VITE_API_URL=https://your-app.railway.app
```

### 2. Build Yap
```powershell
npm run build
```

### 3. İyonos'a Yükle
- FileZilla ile `dist/` klasörünü `public/` klasörüne yükle

## ✅ Test
- Frontend: https://solvidaclean.com
- Backend: https://your-app.railway.app/api/health

