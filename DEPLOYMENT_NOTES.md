# 📝 Deployment Notları - Önemli Bilgiler

## 📁 Server Klasör Yapısı

Server'da **`public`** klasörü web root klasörü. Tüm dosyaları buraya yükleyin.

### Yükleme Yapısı:

```
Server'da public/ klasörü:
├── index.html              (dist/ içinden)
├── assets/                 (dist/ içinden)
├── images/                 (dist/ içinden)
├── services/               (dist/ içinden)
├── slider/                 (dist/ içinden)
├── about/                  (dist/ içinden)
├── server/                 (backend klasörü)
│   ├── index.js
│   ├── send_email.js
│   ├── emailTemplate.js
│   └── resend_api.js
├── package.json
├── package-lock.json
├── .env                    (.env.production'dan)
└── ecosystem.config.js
```

## ⚠️ ÖNEMLİ NOTLAR

1. **`dist/` klasörünün içeriğini** `public/` klasörüne yükleyin
   - `dist/index.html` → `public/index.html`
   - `dist/assets/` → `public/assets/`
   - `dist/images/` → `public/images/`
   - vb.

2. **`server/` klasörünü** `public/server/` olarak yükleyin

3. **Config dosyalarını** `public/` klasörüne yükleyin:
   - `package.json`
   - `package-lock.json`
   - `.env.production` → `.env` olarak kaydedin
   - `ecosystem.config.js`

4. **`public/` klasörü zaten var**, yeni klasör oluşturmayın!

## 🔧 SSH Komutları

```bash
# Server'a bağlan
ssh su48783@access-5019269728.webspace-host.com

# Public klasörüne git
cd ~/public

# Dosyaların yüklendiğini kontrol et
ls -la

# Dependencies yükle
npm install --production

# PM2 yükle
npm install -g pm2

# Server'ı başlat
pm2 start ecosystem.config.js

# Otomatik başlatma
pm2 startup
pm2 save

# Durum kontrol
pm2 status
```

## ✅ Test

- Website: https://solvidaclean.com
- API: https://solvidaclean.com/api/health
- Admin: https://solvidaclean.com/admin

