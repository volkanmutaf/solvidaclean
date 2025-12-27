# 🤖 Otomatik Deployment Rehberi

## ⚡ Hızlı Başlangıç

Yeni şifre: `Volcano2135$$`

## Yöntem 1: PowerShell Script (Önerilen)

### Adım 1: WinSCP İndir (Eğer yoksa)

1. https://winscp.net/eng/download.php
2. WinSCP'yi indirin ve kurun
3. Kurulum sırasında "Install .NET assembly" seçeneğini işaretleyin

### Adım 2: Script'i Çalıştır

PowerShell'i **Administrator** olarak açın ve:

```powershell
cd D:\Users\Vol\Desktop\BC\binoclean
.\deploy-to-ionos.ps1
```

Script otomatik olarak:
- ✅ Server'a bağlanacak
- ✅ Tüm dosyaları yükleyecek
- ✅ .env dosyasını oluşturacak

### Adım 3: SSH ile Server Kurulumu

Dosyalar yüklendikten sonra SSH ile bağlanın:

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

## Yöntem 2: FileZilla (Manuel - Kolay)

### Adım 1: FileZilla ile Bağlan

1. FileZilla'yı açın
2. **File → Site Manager → New Site**
3. Bilgileri girin:
   ```
   Host: access-5019269728.webspace-host.com
   Port: 22
   Protocol: SFTP
   User: su48783
   Password: Volcano2135$$
   ```
4. **Connect**

### Adım 2: Dosyaları Yükle

**Sol tarafta (Local):** Proje klasörünüz
**Sağ tarafta (Remote):** Server'daki `public` klasörü

**Yüklenecek:**
- `dist/` klasörünün **içeriği** → `public/` klasörüne
- `server/` klasörü → `public/server/`
- `public/` klasörünün içeriği → `public/` klasörüne
- `package.json`
- `package-lock.json`
- `.env.production` → Server'da `.env` olarak kaydedin
- `ecosystem.config.js`

### Adım 3: SSH ile Server Kurulumu

(Yukarıdaki gibi)

---

## Yöntem 3: PSCP (PuTTY SCP)

### Adım 1: PuTTY İndir

1. https://www.putty.org/
2. PSCP'yi indirin: https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
3. `pscp.exe` dosyasını `C:\Windows\System32\` klasörüne kopyalayın

### Adım 2: Script'i Çalıştır

```powershell
cd D:\Users\Vol\Desktop\BC\binoclean
.\auto-deploy.ps1
```

---

## 🔧 SSH Bağlantı Bilgileri

```bash
Host: access-5019269728.webspace-host.com
Port: 22
User: su48783
Password: Volcano2135$$
```

## 📋 Server Komutları (SSH'de)

```bash
# 1. Public klasörüne git
cd ~/public

# 2. Dosyaları kontrol et
ls -la

# 3. Dependencies yükle
npm install --production

# 4. PM2 yükle
npm install -g pm2

# 5. Server'ı başlat
pm2 start ecosystem.config.js

# 6. Otomatik başlatma
pm2 startup
# (Çıkan komutu kopyalayıp çalıştırın)

pm2 save

# 7. Durum kontrol
pm2 status
pm2 logs solvidaclean-api
```

## ✅ Test

- Website: https://solvidaclean.com
- API: https://solvidaclean.com/api/health
- Admin: https://solvidaclean.com/admin

---

## 🆘 Sorun mu var?

1. **Script çalışmıyor**: FileZilla ile manuel yükleyin
2. **SSH bağlanamıyorum**: PuTTY kullanın
3. **Dosyalar yüklenmedi**: FileZilla loglarını kontrol edin

