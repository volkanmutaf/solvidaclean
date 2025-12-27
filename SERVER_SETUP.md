# 🔧 Server Kurulum Adımları

## 1️⃣ SSH ile Bağlan

PowerShell veya Command Prompt'ta:

```bash
ssh su48783@access-5019269728.webspace-host.com
```

**Şifre sorduğunda:** `Volcano2135$$` yazın (yazarken görünmeyecek, normal)

## 2️⃣ Server'da Komutlar (Sırayla)

Bağlandıktan sonra şu komutları **sırayla** çalıştırın:

```bash
# 1. Public klasörüne git
cd ~/public

# 2. Dosyaların yüklendiğini kontrol et
ls -la

# 3. .env dosyasının olduğunu kontrol et
ls -la .env

# 4. Dependencies yükle (SADECE production dependencies)
npm install --production

# 5. PM2 yükle (process manager - server'ı çalışır tutmak için)
npm install -g pm2

# 6. Server'ı başlat
pm2 start ecosystem.config.js

# 7. PM2'yi sistem başlangıcında otomatik başlat
pm2 startup
# (Çıkan komutu kopyalayıp çalıştırın - örnek: sudo env PATH=...)

# 8. PM2 ayarlarını kaydet
pm2 save

# 9. Server durumunu kontrol et
pm2 status
# "online" yazması gerekiyor

# 10. Logları görüntüle (isteğe bağlı)
pm2 logs solvidaclean-api
# Ctrl+C ile çıkabilirsiniz
```

## ✅ Test

1. **Website:** https://solvidaclean.com
2. **API Health:** https://solvidaclean.com/api/health
3. **Admin Panel:** https://solvidaclean.com/admin

## 🐛 Sorun Giderme

### Server başlamıyor:
```bash
pm2 logs solvidaclean-api
# Hata mesajlarını kontrol edin
```

### Email gönderilmiyor:
- `.env` dosyasında `RESEND_API_KEY` kontrol edin
- Server loglarını kontrol edin: `pm2 logs`

### Frontend açılmıyor:
- `dist/` klasörünün doğru yerde olduğunu kontrol edin
- Browser console'da hataları kontrol edin (F12)

### npm install hata veriyor:
- Node.js versiyonunu kontrol edin: `node --version`
- npm versiyonunu kontrol edin: `npm --version`

