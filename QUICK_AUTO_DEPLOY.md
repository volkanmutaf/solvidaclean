# ⚡ Hızlı Otomatik Deployment

## 🎯 En Kolay Yöntem: FileZilla (2 Dakika)

### 1. FileZilla İndir ve Aç
- https://filezilla-project.org/download.php?type=client
- FileZilla'yı açın

### 2. Bağlan
- **File → Site Manager → New Site**
- Bilgileri girin:
  ```
  Host: access-5019269728.webspace-host.com
  Port: 22
  Protocol: SFTP
  User: su48783
  Password: Volcano2135$$
  ```
- **Connect**

### 3. Dosyaları Sürükle-Bırak
**Sol tarafta:** `D:\Users\Vol\Desktop\BC\binoclean`
**Sağ tarafta:** Server'daki `public` klasörü

**Yükle:**
1. `dist` klasörünün **içindeki tüm dosyaları** seç → Sağ tarafa sürükle
2. `server` klasörünü seç → Sağ tarafa sürükle
3. `public` klasörünün içindeki dosyaları seç → Sağ tarafa sürükle
4. `package.json`, `package-lock.json`, `ecosystem.config.js` → Sağ tarafa sürükle
5. `.env.production` → Sağ tarafa sürükle → Server'da `.env` olarak yeniden adlandır

**✅ Tamamlandı!** (2-3 dakika)

---

## 🤖 Otomatik Script (İleri Seviye)

### PowerShell Script Kullanımı:

1. **WinSCP İndir** (eğer yoksa):
   - https://winscp.net/eng/download.php
   - Kurulum sırasında ".NET assembly" seçeneğini işaretleyin

2. **Script'i Çalıştır:**
   ```powershell
   cd D:\Users\Vol\Desktop\BC\binoclean
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\deploy-to-ionos.ps1
   ```

Script otomatik olarak tüm dosyaları yükleyecek!

---

## 🔧 SSH ile Server Kurulumu (Her İki Yöntemden Sonra)

Dosyalar yüklendikten sonra:

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

---

## ✅ Test

- Website: https://solvidaclean.com
- API: https://solvidaclean.com/api/health

---

## 💡 Öneri

**En kolay:** FileZilla ile manuel yükleme (2-3 dakika)
**Otomatik:** WinSCP + PowerShell script (1 dakika, ama WinSCP kurulumu gerekir)

