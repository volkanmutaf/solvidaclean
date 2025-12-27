# 🚀 SolVida Clean - Production Deployment Guide

## 📋 Ön Gereksinimler

### 1. İyonos Hosting Kontrolü
İyonos hosting'inizde **Node.js desteği** olup olmadığını kontrol edin:
- İyonos kontrol panelinde "Node.js" veya "Application" bölümünü kontrol edin
- Eğer Node.js yoksa, alternatif çözümler için aşağıdaki bölüme bakın

### 2. Gerekli Bilgiler
- ✅ Domain: `solvidaclean.com`
- ✅ SFTP Bilgileri:
  - Server: `access-5019269728.webspace-host.com`
  - Port: `22`
  - Protocol: `SFTP`
  - Username: `su48783`
  - Password: (İyonos panelinden alınacak)

### 3. Environment Variables
Production için `.env` dosyası oluşturun:

```env
RESEND_API_KEY=re_your_resend_api_key_here
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
PORT=3001
```

## 🔧 Deployment Seçenekleri

### Seçenek 1: İyonos'ta Node.js Varsa (Önerilen)

#### Adım 1: Local Build
```bash
# Dependencies yükle
npm install

# Production build
npm run build

# Build çıktısı: dist/ klasörü
```

#### Adım 2: SFTP ile Dosya Yükleme
1. **FileZilla veya CyberDuck** ile bağlanın
2. **Yüklenecek dosyalar:**
   - `dist/` klasörü (frontend build)
   - `server/` klasörü (backend)
   - `package.json`
   - `package-lock.json`
   - `.env` (production environment variables)
   - `public/` klasörü (images, assets)

3. **Server'da klasör yapısı:**
   ```
   /home/su48783/
   ├── dist/              # Frontend build
   ├── server/            # Backend
   ├── public/            # Static assets
   ├── package.json
   ├── package-lock.json
   └── .env               # Production env vars
   ```

#### Adım 3: Server'da Kurulum
SSH ile bağlanın ve:
```bash
# Node.js ve npm yüklü mü kontrol et
node --version
npm --version

# Dependencies yükle
npm install --production

# PM2 yükle (process manager)
npm install -g pm2

# PM2 ile server'ı başlat
pm2 start server/index.js --name solvidaclean-api

# Frontend için static file server (nginx veya apache gerekebilir)
# veya PM2 ile serve edilebilir
```

#### Adım 4: Domain Yapılandırması
İyonos kontrol panelinde:
1. **Domain ayarlarına** gidin
2. **DNS kayıtlarını** kontrol edin:
   - `A` kaydı: `@` → Server IP
   - `CNAME` kaydı: `www` → `solvidaclean.com`

3. **Web server yapılandırması:**
   - Frontend: `dist/` klasörünü serve et
   - Backend API: `http://localhost:3001` proxy et
   - Nginx veya Apache reverse proxy kurulumu gerekebilir

### Seçenek 2: İyonos'ta Node.js Yoksa (Alternatif)

#### A) Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
1. GitHub'a projeyi push edin
2. Vercel'e bağlayın: https://vercel.com
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables ekleyin

**Backend (Railway/Render):**
1. Railway: https://railway.app veya Render: https://render.com
2. GitHub repo'yu bağlayın
3. Root directory: `server/`
4. Start command: `node index.js`
5. Environment variables ekleyin
6. Domain'i backend'e yönlendirin

#### B) Netlify (Full Stack)

1. GitHub'a projeyi push edin
2. Netlify'e bağlayın: https://netlify.com
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Netlify Functions ile backend API'yi deploy edin

## 🔄 Geliştirme ve Canlı Ortamı Senkronize Etme

### Git Workflow Önerisi

```bash
# 1. Git repository oluştur
git init
git add .
git commit -m "Initial commit"

# 2. GitHub'a push
git remote add origin https://github.com/yourusername/solvidaclean.git
git push -u origin main

# 3. Development branch
git checkout -b development
git push -u origin development

# 4. Production branch
git checkout -b production
git push -u origin production
```

### Deployment Script

`deploy.sh` script'i kullanarak:
```bash
chmod +x deploy.sh
./deploy.sh production
```

## 📝 Production Checklist

- [ ] `.env` dosyası production değerleriyle oluşturuldu
- [ ] `RESEND_API_KEY` production key ile güncellendi
- [ ] `WEBSITE_URL` `https://solvidaclean.com` olarak ayarlandı
- [ ] Firebase security rules production için güncellendi
- [ ] Frontend build yapıldı (`npm run build`)
- [ ] Backend server production modda çalışıyor
- [ ] Domain DNS kayıtları doğru yapılandırıldı
- [ ] SSL sertifikası aktif (HTTPS)
- [ ] Email domain doğrulandı (Resend)
- [ ] Test email gönderildi ve çalışıyor
- [ ] Admin panel erişimi test edildi
- [ ] Quote submission test edildi
- [ ] Appointment booking test edildi

## 🐛 Troubleshooting

### Server başlamıyor
```bash
# Logları kontrol et
pm2 logs solvidaclean-api

# Server'ı yeniden başlat
pm2 restart solvidaclean-api
```

### Email gönderilmiyor
- `.env` dosyasında `RESEND_API_KEY` kontrol et
- Resend dashboard'da domain doğrulaması kontrol et
- Server loglarını kontrol et: `pm2 logs`

### Frontend açılmıyor
- Build dosyalarının doğru yerde olduğunu kontrol et
- Web server yapılandırmasını kontrol et
- Browser console'da hataları kontrol et

## 📞 Destek

Sorun yaşarsanız:
1. Server loglarını kontrol edin
2. Browser console'u kontrol edin
3. Network tab'ında API isteklerini kontrol edin

