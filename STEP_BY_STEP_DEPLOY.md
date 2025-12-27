# 🚀 Adım Adım Deployment Rehberi

## ✅ Adım 1: Production .env Dosyası Hazır!

✅ **Tamamlandı!** `.env.production` dosyası oluşturuldu:
- Resend API Key: `re_H1WGZDH9_EoaZfh1PGWkBwJfWcHW1t4u6`
- Website URL: `https://solvidaclean.com`
- Environment: `production`

**ÖNEMLİ**: Server'a yüklerken bu dosyayı `.env` olarak kaydedin!

---

## 📤 Adım 2: FileZilla Kurulumu ve Bağlantı

### FileZilla İndirme (Yoksa):
1. https://filezilla-project.org/download.php?type=client
2. **FileZilla Client**'ı indirin ve kurun

### Bağlantı Ayarları:
1. FileZilla'yı açın
2. **File → Site Manager** (veya `Ctrl+S`)
3. **New Site** butonuna tıklayın
4. Site adı: `SolVida Clean Production`
5. Bilgileri girin:
   ```
   Host: access-5019269728.webspace-host.com
   Port: 22
   Protocol: SFTP - SSH File Transfer Protocol
   Logon Type: Normal
   User: su48783
   Password: 335241Vb!
   ```
6. **Connect** butonuna tıklayın

### Bağlantı Başarılı mı?
- ✅ Sol tarafta: Local (bilgisayarınız - `D:\Users\Vol\Desktop\BC\binoclean`)
- ✅ Sağ tarafta: Remote (İyonos server)

---

## 📁 Adım 3: Dosya Yükleme

### Yüklenecek Dosyalar:

#### 1️⃣ Frontend Build (dist/)
**Sol tarafta:**
- `D:\Users\Vol\Desktop\BC\binoclean\dist\` klasörüne gidin

**Sağ tarafta:**
- Server'da `public` klasörüne gidin (veya İyonos'un belirttiği ana klasör)

**Yükleme:**
- `dist` klasörünün **İÇİNDEKİ TÜM DOSYALARI** seçin
- Sağ tarafa sürükleyip bırakın
- **ÖNEMLİ**: `dist` klasörünü değil, içindeki dosyaları yükleyin!

**Yüklenecek:**
- `index.html`
- `assets/` klasörü
- `images/` klasörü
- `services/` klasörü
- `slider/` klasörü
- `about/` klasörü

#### 2️⃣ Backend (server/)
**Sol tarafta:**
- `server\` klasörünü seçin

**Yükleme:**
- Tüm klasörü sağ tarafa sürükleyin
- İçindeki tüm dosyalar yüklenecek:
  - `index.js`
  - `send_email.js`
  - `emailTemplate.js`
  - `resend_api.js`

#### 3️⃣ Public Assets (public/)
**NOT**: Server'da zaten `public` klasörü var, bu web root klasörü.

**Sol tarafta:**
- `public\` klasörünün içindeki dosyaları seçin (images, services, slider, about)

**Yükleme:**
- Server'daki `public` klasörüne yükleyin
- Images ve diğer static dosyalar yüklenecek
- **ÖNEMLİ**: Server'daki `public` klasörüne yükleyin, yeni klasör oluşturmayın!

#### 4️⃣ Config Dosyaları
**Sol tarafta:**
- Aşağıdaki dosyaları seçin:
  - `package.json`
  - `package-lock.json`
  - `.env.production` → **Server'da `.env` olarak kaydedin!**
  - `ecosystem.config.js`

**Yükleme:**
- Dosyaları sağ tarafa sürükleyin
- `.env.production` dosyasını server'da `.env` olarak yeniden adlandırın

### ❌ YÜKLEMEYİN:
- ❌ `node_modules/` klasörü
- ❌ `src/` klasörü
- ❌ `.git/` klasörü
- ❌ Development dosyaları

---

## 🔧 Adım 4: Server'da Kurulum (SSH)

### SSH Bağlantısı:

**Windows PowerShell veya Command Prompt'u açın:**

```bash
ssh su48783@access-5019269728.webspace-host.com
```

**Şifre sorduğunda:** `335241Vb!` yazın ve Enter'a basın

### Server'da Komutlar (Sırayla):

```bash
# 1. Proje klasörüne git
cd ~/public
# veya İyonos'un belirttiği ana klasör (kontrol panelinden bakın)

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

# 10. Logları görüntüle
pm2 logs solvidaclean-api
# Ctrl+C ile çıkabilirsiniz
```

---

## ✅ Adım 5: Test

### 1. Website Test:
- Tarayıcıda açın: **https://solvidaclean.com**
- Ana sayfa açılmalı

### 2. API Health Check:
- Tarayıcıda açın: **https://solvidaclean.com/api/health**
- Şu cevabı görmelisiniz:
```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "2025-01-XX..."
}
```

### 3. Admin Panel:
- Tarayıcıda açın: **https://solvidaclean.com/admin**
- Login sayfası açılmalı

### 4. Email Test:
- Admin panelden bir quote açın
- Email gönderin
- Email'in gittiğini kontrol edin

---

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

### SSH bağlanamıyorum:
- İyonos kontrol panelinde SSH erişiminin aktif olduğunu kontrol edin
- Port 22'nin açık olduğunu kontrol edin

---

## 📋 Özet Checklist

- [ ] FileZilla kuruldu ve bağlantı yapıldı
- [ ] `dist/` klasörü içeriği yüklendi
- [ ] `server/` klasörü yüklendi
- [ ] `public/` klasörü yüklendi
- [ ] `package.json`, `package-lock.json` yüklendi
- [ ] `.env.production` → `.env` olarak yüklendi
- [ ] `ecosystem.config.js` yüklendi
- [ ] SSH ile server'a bağlanıldı
- [ ] `npm install --production` çalıştırıldı
- [ ] PM2 yüklendi
- [ ] Server başlatıldı (`pm2 start`)
- [ ] PM2 otomatik başlatma ayarlandı
- [ ] Website test edildi
- [ ] API health check yapıldı
- [ ] Email test edildi

---

## 🎯 Şimdi Ne Yapmalıyım?

1. **FileZilla'yı açın** ve bağlanın
2. **Dosyaları yükleyin** (yukarıdaki adımları takip edin)
3. **SSH ile server'a bağlanın** ve kurulum yapın
4. **Test edin**

Her adımda sorun olursa haber verin! 🚀

