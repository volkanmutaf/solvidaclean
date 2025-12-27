# 🔧 İyonos Routing Düzeltme

## ❌ Sorun
"Not Found" hatası - React Router route'ları çalışmıyor.

## ✅ Çözüm
`.htaccess` dosyası oluşturuldu ve `dist/` klasörüne eklendi.

## 📤 İyonos'a Yükleme

### FileZilla ile:

1. **Bağlan:**
   - Host: `access-5019269728.webspace-host.com`
   - Port: `22`
   - User: `su48783`
   - Password: (Environment variable'dan alın: `$env:IONOS_SFTP_PASSWORD`)

2. **Yükle:**
   - `dist/.htaccess` dosyasını server'daki `public/` klasörüne yükleyin
   - `dist/` klasörünün içindeki tüm dosyaları zaten yüklemiştiniz

### ÖNEMLİ:
`.htaccess` dosyası **mutlaka** server'da `public/` klasöründe olmalı!

## ✅ Test

1. **Ana sayfa:** https://solvidaclean.com
2. **Admin panel:** https://solvidaclean.com/admin
3. **Diğer sayfalar:** https://solvidaclean.com/contact, vb.

## 🐛 Hala Çalışmıyorsa

İyonos Apache kullanmıyorsa (Nginx kullanıyorsa), `.htaccess` çalışmaz. O zaman İyonos kontrol panelinden URL rewrite ayarı yapmanız gerekebilir.

