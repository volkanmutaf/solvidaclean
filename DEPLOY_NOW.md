# 🚀 Şimdi Deployment Yapalım!

## ⚠️ WinSCP .NET Assembly Bulunamadı

WinSCP kuruldu ama ".NET assembly" seçeneği kurulmamış olabilir.

## 🔧 Çözüm 1: WinSCP'yi Yeniden Kur (Önerilen)

1. **WinSCP'yi kaldırın** (Control Panel → Programs)
2. **WinSCP'yi yeniden indirin**: https://winscp.net/eng/download.php
3. **Kurulum sırasında:**
   - ✅ **"Install .NET assembly for use from PowerShell"** seçeneğini işaretleyin
   - ✅ **"Install .NET assembly"** seçeneğini işaretleyin
4. Kurulumu tamamlayın
5. Script'i tekrar çalıştırın: `.\deploy-to-ionos.ps1`

## 🔧 Çözüm 2: FileZilla ile Manuel Yükleme (Hızlı)

WinSCP'yi yeniden kurmak istemiyorsanız, FileZilla ile manuel yükleyebilirsiniz:

### FileZilla ile Bağlan:

1. **FileZilla'yı açın**
2. **File → Site Manager → New Site**
3. Bilgileri girin:
   ```
   Host: access-5019269728.webspace-host.com
   Port: 22
   Protocol: SFTP - SSH File Transfer Protocol
   User: su48783
   Password: Volcano2135$$
   ```
4. **Connect**

### Dosyaları Yükle:

**Sol tarafta:** `D:\Users\Vol\Desktop\BC\binoclean`
**Sağ tarafta:** Server'daki `public` klasörü

**Yüklenecek:**
1. `dist/` klasörünün **içindeki tüm dosyaları** seç → Sağ tarafa sürükle
2. `server/` klasörü → Sağ tarafa sürükle
3. `public/` klasörünün içindeki dosyaları seç → Sağ tarafa sürükle
4. `package.json`, `package-lock.json`, `ecosystem.config.js` → Sağ tarafa sürükle
5. `.env.production` → Sağ tarafa sürükle → Server'da `.env` olarak yeniden adlandır

**✅ Tamamlandı!** (2-3 dakika)

## 🔧 Çözüm 3: WinSCP GUI Kullan

WinSCP'yi GUI olarak kullanabilirsiniz:

1. **WinSCP'yi açın**
2. **Yeni site oluştur:**
   - File → New Site
   - **File protocol:** SFTP
   - **Host name:** `access-5019269728.webspace-host.com`
   - **Port number:** `22`
   - **User name:** `su48783`
   - **Password:** `Volcano2135$$`
3. **Login** butonuna tıklayın
4. Dosyaları sürükle-bırak ile yükleyin

## 📋 Dosyalar Yüklendikten Sonra

SSH ile server'a bağlanın:

```bash
ssh su48783@access-5019269728.webspace-host.com
# Şifre: Volcano2135$$
```

Server'da:
```bash
cd ~/public
npm install --production
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
pm2 status
```

## ✅ Test

- Website: https://solvidaclean.com
- API: https://solvidaclean.com/api/health

---

## 💡 Öneri

**En hızlı:** FileZilla ile manuel yükleme (2-3 dakika)
**Otomatik:** WinSCP'yi yeniden kur + script çalıştır

Hangi yöntemi tercih edersiniz?

