# 🚀 İyonos Hosting - Deployment Rehberi

## 📋 Ön Hazırlık

### 1. İyonos Kontrol Paneli Kontrolü
İyonos hosting'inizde **Node.js desteği** olup olmadığını kontrol edin:
- İyonos kontrol paneline giriş yapın
- "Websites & Domains" veya "Hosting" bölümüne gidin
- "Node.js" veya "Application" seçeneğini arayın
- Eğer Node.js yoksa, alternatif çözümler için aşağıdaki bölüme bakın

### 2. SFTP Bağlantı Bilgileri
- **Server**: `access-5019269728.webspace-host.com`
- **Port**: `22`
- **Protocol**: `SFTP`
- **Username**: `su48783`
- **Password**: İyonos kontrol panelinden alınacak

## 🔧 Deployment Adımları

### Adım 1: Local Build

```bash
# 1. Dependencies yükle
npm install

# 2. Production build oluştur
npm run build

# Build çıktısı: dist/ klasörü
```

### Adım 2: Environment Variables Hazırlama

`.env` dosyası oluşturun (production için):

```env
RESEND_API_KEY=re_your_production_resend_api_key
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
PORT=3001
```

**ÖNEMLİ**: `.env` dosyasını asla Git'e commit etmeyin!

### Adım 3: SFTP ile Dosya Yükleme

#### FileZilla ile Bağlantı:
1. FileZilla'yı açın
2. **File → Site Manager → New Site**
3. Bilgileri girin:
   - **Host**: `access-5019269728.webspace-host.com`
   - **Port**: `22`
   - **Protocol**: `SFTP - SSH File Transfer Protocol`
   - **Logon Type**: `Normal`
   - **User**: `su48783`
   - **Password**: (İyonos panelinden alınacak)
4. **Connect** butonuna tıklayın

#### Yüklenecek Dosyalar:
```
📁 Yüklenecek klasörler ve dosyalar:
├── dist/                    # Frontend build (ÖNEMLİ!)
├── server/                  # Backend kodları
├── public/                  # Static assets (images, etc.)
├── package.json
├── package-lock.json
├── .env                     # Production environment variables
└── ecosystem.config.js      # PM2 config
```

**NOT**: `node_modules/` klasörünü yüklemeyin, server'da `npm install` yapacaksınız.

### Adım 4: Server'da Kurulum (SSH)

İyonos'ta SSH erişimi varsa:

```bash
# 1. SSH ile bağlan
ssh su48783@access-5019269728.webspace-host.com

# 2. Proje klasörüne git
cd ~/public  # veya İyonos'un belirttiği ana klasör

# 3. Dependencies yükle
npm install --production

# 4. PM2 yükle (process manager)
npm install -g pm2

# 5. PM2 ile server'ı başlat
pm2 start ecosystem.config.js

# 6. PM2'yi sistem başlangıcında otomatik başlat
pm2 startup
pm2 save

# 7. Server durumunu kontrol et
pm2 status
pm2 logs solvidaclean-api
```

### Adım 5: Domain ve Web Server Yapılandırması

#### İyonos Kontrol Panelinde:
1. **Domain ayarlarına** gidin
2. **DNS kayıtlarını** kontrol edin:
   - `A` kaydı: `@` → Server IP adresi
   - `CNAME` kaydı: `www` → `solvidaclean.com`

#### Web Server Yapılandırması:

İyonos'ta genellikle **Apache** veya **Nginx** kullanılır. Eğer Node.js desteği yoksa:

**Seçenek A: Reverse Proxy (Nginx/Apache)**
```nginx
# Nginx örnek yapılandırması
server {
    listen 80;
    server_name solvidaclean.com www.solvidaclean.com;

    # Frontend static files
    location / {
        root /home/su48783/public/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Seçenek B: Sadece Frontend (Backend ayrı hosting)**
- Frontend: İyonos'ta static hosting
- Backend: Railway, Render, veya Heroku'da deploy

## 🔄 Alternatif Deployment Çözümleri

### İyonos'ta Node.js Yoksa:

#### 1. Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
# 1. GitHub'a push
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/solvidaclean.git
git push -u origin main

# 2. Vercel'e bağla
# - https://vercel.com → Import Project
# - GitHub repo'yu seç
# - Build Settings:
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Install Command: npm install
# - Environment Variables:
#   - VITE_API_URL=https://your-backend-url.railway.app
```

**Backend (Railway):**
```bash
# 1. Railway'e kaydol: https://railway.app
# 2. New Project → Deploy from GitHub
# 3. Root Directory: server/
# 4. Start Command: node index.js
# 5. Environment Variables ekle:
#    - RESEND_API_KEY
#    - WEBSITE_URL
#    - NODE_ENV=production
#    - PORT (Railway otomatik atar)
```

#### 2. Netlify (Full Stack)

```bash
# 1. GitHub'a push
# 2. Netlify'e bağla: https://netlify.com
# 3. Build Settings:
#    - Build command: npm run build
#    - Publish directory: dist
# 4. Netlify Functions ile backend API'yi deploy et
```

## 📝 Production Checklist

- [ ] `.env` dosyası production değerleriyle oluşturuldu
- [ ] `RESEND_API_KEY` production key ile güncellendi
- [ ] `WEBSITE_URL` `https://solvidaclean.com` olarak ayarlandı
- [ ] Frontend build yapıldı (`npm run build`)
- [ ] `dist/` klasörü oluşturuldu ve içinde dosyalar var
- [ ] Dosyalar SFTP ile server'a yüklendi
- [ ] Server'da `npm install --production` çalıştırıldı
- [ ] PM2 ile server başlatıldı
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

# PM2 durumunu kontrol et
pm2 status
```

### Email gönderilmiyor
- `.env` dosyasında `RESEND_API_KEY` kontrol et
- Resend dashboard'da domain doğrulaması kontrol et
- Server loglarını kontrol et: `pm2 logs`

### Frontend açılmıyor
- Build dosyalarının doğru yerde olduğunu kontrol et (`dist/` klasörü)
- Web server yapılandırmasını kontrol et
- Browser console'da hataları kontrol et
- Network tab'ında API isteklerini kontrol et

### API istekleri çalışmıyor
- Backend server'ın çalıştığını kontrol et: `pm2 status`
- CORS ayarlarını kontrol et (server/index.js)
- API URL'lerinin doğru olduğunu kontrol et
- Environment variable `VITE_API_URL` ayarlandı mı?

## 📞 Destek

Sorun yaşarsanız:
1. Server loglarını kontrol edin: `pm2 logs`
2. Browser console'u kontrol edin
3. Network tab'ında API isteklerini kontrol edin
4. İyonos destek ekibiyle iletişime geçin

