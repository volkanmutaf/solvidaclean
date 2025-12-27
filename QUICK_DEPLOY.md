# ⚡ Hızlı Deployment Rehberi

## ✅ Build Tamamlandı!
`dist/` klasörü hazır. Şimdi deployment yapabilirsiniz.

## 🔑 1. Resend API Key Alın

1. https://resend.com/login → Giriş yapın
2. Dashboard → **API Keys** → **Create API Key**
3. Key'i kopyalayın (format: `re_xxxxxxxxxxxxx`)

## 📝 2. Production .env Dosyası Oluştur

Proje klasöründe `.env` dosyası oluşturun:

```env
RESEND_API_KEY=re_buraya_resend_api_key_yapistirin
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
PORT=3001
```

**ÖNEMLİ**: `re_buraya_resend_api_key_yapistirin` kısmını gerçek Resend API key'inizle değiştirin!

## 📤 3. FileZilla ile Dosya Yükleme

### Bağlantı Bilgileri:
- **Host**: `access-5019269728.webspace-host.com`
- **Port**: `22`
- **Protocol**: `SFTP`
- **User**: `su48783`
- **Password**: `335241Vb!`

### Yüklenecek Dosyalar:
1. **dist/** klasörünün TÜM içeriği
2. **server/** klasörünün TÜM içeriği
3. **public/** klasörünün TÜM içeriği
4. **package.json**
5. **package-lock.json**
6. **.env** (production environment variables - yukarıda oluşturduğunuz)
7. **ecosystem.config.js**

**YÜKLEMEYİN**: `node_modules/` klasörünü yüklemeyin!

## 🔧 4. Server'da Kurulum (SSH)

SSH ile bağlanın:
```bash
ssh su48783@access-5019269728.webspace-host.com
# Şifre: 335241Vb!
```

Server'da şu komutları çalıştırın:
```bash
cd ~/public  # veya İyonos'un belirttiği ana klasör

# Dependencies yükle
npm install --production

# PM2 yükle (process manager)
npm install -g pm2

# Server'ı başlat
pm2 start ecosystem.config.js

# Otomatik başlatma ayarla
pm2 startup
pm2 save

# Durumu kontrol et
pm2 status
pm2 logs solvidaclean-api
```

## ✅ 5. Test

1. Website: https://solvidaclean.com
2. API Health: https://solvidaclean.com/api/health
3. Admin Panel: https://solvidaclean.com/admin

## 🆘 Sorun mu var?

- **Server başlamıyor**: `pm2 logs solvidaclean-api`
- **Email gönderilmiyor**: `.env` dosyasında `RESEND_API_KEY` kontrol edin
- **Frontend açılmıyor**: `dist/` klasörünün doğru yerde olduğunu kontrol edin

