# ⚠️ İyonos SFTP Only - Çözüm

## Problem
İyonos hosting'de **SSH shell erişimi yok**, sadece **SFTP** ile dosya yükleme var.

Bu durumda:
- ❌ Server'da komut çalıştıramayız
- ❌ `npm install` yapamayız
- ❌ PM2 kuramayız
- ❌ Backend server'ı başlatamayız

## 🔧 Çözüm Seçenekleri

### Seçenek 1: İyonos Kontrol Paneli (Önerilen)

İyonos kontrol panelinde Node.js desteği olup olmadığını kontrol edin:

1. **İyonos kontrol paneline giriş yapın**
2. **Hosting/Websites** bölümüne gidin
3. **Node.js** veya **Application** seçeneğini arayın
4. Eğer varsa:
   - Node.js versiyonunu seçin
   - Start command: `node server/index.js`
   - Working directory: `public`
   - Environment variables ekleyin:
     - `RESEND_API_KEY=re_H1WGZDH9_EoaZfh1PGWkBwJfWcHW1t4u6`
     - `WEBSITE_URL=https://solvidaclean.com`
     - `NODE_ENV=production`
     - `PORT=3001`

### Seçenek 2: Backend'i Ayrı Hosting'e Deploy (En İyi Çözüm)

Frontend: İyonos'ta static hosting
Backend: Railway/Render/Heroku'da

#### A) Railway (Önerilen - Ücretsiz)

1. **Railway'a kaydolun:** https://railway.app
2. **New Project → Deploy from GitHub**
3. GitHub repo'yu bağlayın
4. **Settings:**
   - Root Directory: `server`
   - Start Command: `node index.js`
5. **Environment Variables:**
   - `RESEND_API_KEY=re_H1WGZDH9_EoaZfh1PGWkBwJfWcHW1t4u6`
   - `WEBSITE_URL=https://solvidaclean.com`
   - `NODE_ENV=production`
   - `PORT` (Railway otomatik atar)
6. **Deploy**

Railway size bir URL verir: `https://your-app.railway.app`

#### B) Render (Alternatif)

1. **Render'a kaydolun:** https://render.com
2. **New → Web Service**
3. GitHub repo'yu bağlayın
4. **Settings:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. **Environment Variables ekleyin** (yukarıdaki gibi)
6. **Deploy**

### Seçenek 3: Frontend'i Güncelle (Backend URL'i değiştir)

Backend'i Railway/Render'a deploy ettikten sonra, frontend'deki API URL'lerini güncellemeniz gerekiyor.

**Vite build sırasında:**
```bash
VITE_API_URL=https://your-backend.railway.app npm run build
```

Veya `.env.production` dosyasına ekleyin:
```env
VITE_API_URL=https://your-backend.railway.app
```

Sonra yeniden build yapın:
```bash
npm run build
```

Ve `dist/` klasörünü İyonos'a yükleyin.

## 📋 Adım Adım (Önerilen: Railway)

### 1. Backend'i Railway'a Deploy

1. Railway'a kaydol: https://railway.app
2. New Project → Deploy from GitHub
3. Repo'yu bağla
4. Settings:
   - Root Directory: `server`
   - Start Command: `node index.js`
5. Environment Variables ekle
6. Deploy

### 2. Frontend'i Güncelle

1. `.env.production` dosyasına ekle:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   ```

2. Build yap:
   ```bash
   npm run build
   ```

3. `dist/` klasörünü İyonos'a yükle (FileZilla ile)

### 3. Test

- Frontend: https://solvidaclean.com
- Backend: https://your-backend.railway.app/api/health

## 🎯 Hızlı Çözüm

**En kolay:** Railway kullanın (5 dakika):
1. Railway'a kaydol
2. GitHub repo'yu bağla
3. Backend'i deploy et
4. Frontend'de API URL'i güncelle
5. Build yap ve İyonos'a yükle

## ❓ Sorular

**Q: İyonos'ta Node.js yok mu?**
A: Kontrol panelinden kontrol edin. Genellikle yoktur, bu yüzden backend'i ayrı deploy etmek gerekir.

**Q: Railway ücretsiz mi?**
A: Evet, ücretsiz plan var. Aylık $5 kredi verir (küçük projeler için yeterli).

**Q: Backend'i nereye deploy edebilirim?**
A: Railway (önerilen), Render, Heroku, DigitalOcean, vb.

