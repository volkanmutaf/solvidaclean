# 🚂 Railway Deployment - Adım Adım

## 📋 Adım 1: GitHub Repo Oluştur

### 1.1. GitHub'da Yeni Repo Oluştur
1. https://github.com → Giriş yapın
2. **New repository** butonuna tıklayın
3. Repo adı: `solvidaclean` (veya istediğiniz isim)
4. **Private** veya **Public** seçin
5. **Initialize with README** işaretlemeyin
6. **Create repository**

### 1.2. Local Repo'yu GitHub'a Push Et

PowerShell'de proje klasöründe:

```powershell
cd D:\Users\Vol\Desktop\BC\binoclean

# Git init (eğer yoksa)
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit - SolVida Clean"

# GitHub repo'yu ekle (YOUR_USERNAME'i değiştirin)
git remote add origin https://github.com/YOUR_USERNAME/solvidaclean.git

# Push et
git branch -M main
git push -u origin main
```

## 📋 Adım 2: Railway'a Deploy

### 2.1. Railway'a Kaydol
1. https://railway.app
2. **"Start a New Project"**
3. **"Deploy from GitHub repo"** seçin
4. GitHub ile giriş yapın
5. **"Authorize Railway"** butonuna tıklayın

### 2.2. Repo'yu Seç
1. **"solvidaclean"** repo'sunu seçin
2. **"Deploy Now"** butonuna tıklayın

### 2.3. Ayarları Yap
1. **Settings** sekmesine gidin
2. **Root Directory:** `server` yazın
3. **Start Command:** `node index.js` yazın

### 2.4. Environment Variables Ekle
**Variables** sekmesine gidin ve ekleyin:

```
RESEND_API_KEY=re_H1WGZDH9_EoaZfh1PGWkBwJfWcHW1t4u6
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
```

**NOT:** `PORT` otomatik atanır, eklemeyin!

### 2.5. Deploy
- Railway otomatik deploy edecek
- **Settings** → **Domains** → **Generate Domain** ile URL alın
- URL'i kopyalayın: `https://your-app.railway.app`

## 📋 Adım 3: Frontend'i Güncelle

### 3.1. API URL'i Güncelle

`.env.production` dosyasına ekleyin:
```env
VITE_API_URL=https://your-app.railway.app
```

### 3.2. CORS Ayarlarını Güncelle

`server/index.js` dosyasında CORS ayarlarını güncelleyin (Railway URL'i ekleyin).

### 3.3. Build Yap

```powershell
npm run build
```

## 📋 Adım 4: İyonos'a Frontend Yükle

### 4.1. FileZilla ile Bağlan
- Host: `access-5019269728.webspace-host.com`
- Port: `22`
- User: `su48783`
- Password: `Volcano2135$$`

### 4.2. Dosyaları Yükle
- `dist/` klasörünün içeriğini `public/` klasörüne yükleyin

## ✅ Test

- Frontend: https://solvidaclean.com
- Backend: https://your-app.railway.app/api/health

