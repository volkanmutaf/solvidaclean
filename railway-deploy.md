# 🚂 Railway Deployment - Hızlı Rehber

## ⚡ 5 Dakikada Backend Deploy

### 1. Railway'a Kaydol
- https://railway.app
- GitHub ile giriş yapın

### 2. Yeni Proje Oluştur
1. **New Project** → **Deploy from GitHub repo**
2. Repo'yu seçin (veya yeni repo oluşturun)

### 3. Ayarlar
1. **Settings** → **Root Directory:** `server`
2. **Settings** → **Start Command:** `node index.js`

### 4. Environment Variables
**Variables** sekmesine gidin ve ekleyin:

```
RESEND_API_KEY=re_H1WGZDH9_EoaZfh1PGWkBwJfWcHW1t4u6
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
```

**NOT:** `PORT` otomatik atanır, eklemeyin.

### 5. Deploy
- Railway otomatik deploy edecek
- URL'i kopyalayın: `https://your-app.railway.app`

### 6. Frontend'i Güncelle

`.env.production` dosyasına ekleyin:
```env
VITE_API_URL=https://your-app.railway.app
```

Build yapın:
```bash
npm run build
```

### 7. İyonos'a Yükle
- `dist/` klasörünü FileZilla ile İyonos'a yükleyin

## ✅ Test

- Frontend: https://solvidaclean.com
- Backend: https://your-app.railway.app/api/health

