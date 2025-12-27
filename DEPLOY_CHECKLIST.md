# ✅ Deployment Checklist - Adım Adım

## 📋 Adım 1: Production .env Dosyası ✅
- [x] Resend API Key eklendi: `re_H1WGZDH9_EoaZfh1PGWkBwJfWcHW1t4u6`
- [x] Production .env dosyası oluşturuldu

**Dosya**: `.env.production` → Server'a yüklerken `.env` olarak kaydedin!

## 📦 Adım 2: Build Kontrolü ✅
- [x] Production build yapıldı
- [x] `dist/` klasörü hazır

## 📤 Adım 3: FileZilla Kurulumu ve Bağlantı

### FileZilla İndirme (Yoksa):
1. https://filezilla-project.org/download.php?type=client
2. FileZilla Client'ı indirin ve kurun

### Bağlantı Ayarları:
1. FileZilla'yı açın
2. **File → Site Manager** (veya Ctrl+S)
3. **New Site** butonuna tıklayın
4. Site adı: `SolVida Clean Production`
5. Bilgileri girin:
   - **Host**: `access-5019269728.webspace-host.com`
   - **Port**: `22`
   - **Protocol**: `SFTP - SSH File Transfer Protocol` (dropdown'dan seçin)
   - **Logon Type**: `Normal`
   - **User**: `su48783`
   - **Password**: `335241Vb!`
6. **Connect** butonuna tıklayın

### Bağlantı Başarılı mı?
- ✅ Sol tarafta: Local (bilgisayarınız)
- ✅ Sağ tarafta: Remote (İyonos server)

## 📁 Adım 4: Dosya Yükleme

### Yüklenecek Dosyalar Listesi:

#### 1. Frontend Build (dist/)
- Sol tarafta: `D:\Users\Vol\Desktop\BC\binoclean\dist\` klasörüne gidin
- Sağ tarafta: Server'da `public` klasörüne gidin
- `dist` klasörünün **İÇİNDEKİ TÜM DOSYALARI** seçin ve sağ tarafa sürükleyin
- **ÖNEMLİ**: `dist` klasörünü değil, içindeki dosyaları yükleyin!

#### 2. Backend (server/)
- Sol tarafta: `server\` klasörünü seçin
- Sağ tarafa sürükleyin
- Tüm dosyalar yüklenecek: `index.js`, `send_email.js`, `emailTemplate.js`, vb.

#### 3. Public Assets (public/)
- Sol tarafta: `public\` klasörünü seçin
- Sağ tarafa sürükleyin
- Images ve diğer static dosyalar yüklenecek

#### 4. Config Dosyaları
- `package.json`
- `package-lock.json`
- `.env.production` → Server'da `.env` olarak kaydedin!
- `ecosystem.config.js`

### YÜKLEMEYİN:
- ❌ `node_modules/` klasörü
- ❌ `src/` klasörü
- ❌ `.git/` klasörü
- ❌ Development dosyaları

## 🔧 Adım 5: Server'da Kurulum (SSH)

### SSH Bağlantısı:

**Windows PowerShell veya Command Prompt'u açın:**

```bash
ssh su48783@access-5019269728.webspace-host.com
```

Şifre sorduğunda: `335241Vb!` yazın

### Server'da Komutlar:

```bash
# 1. Proje klasörüne git
cd ~/public
# veya İyonos'un belirttiği ana klasör (kontrol panelinden bakın)

# 2. Dosyaların yüklendiğini kontrol et
ls -la

# 3. Dependencies yükle (SADECE production dependencies)
npm install --production

# 4. PM2 yükle (process manager - server'ı çalışır tutmak için)
npm install -g pm2

# 5. Server'ı başlat
pm2 start ecosystem.config.js

# 6. PM2'yi sistem başlangıcında otomatik başlat
pm2 startup
# (Çıkan komutu kopyalayıp çalıştırın)

# 7. PM2 ayarlarını kaydet
pm2 save

# 8. Server durumunu kontrol et
pm2 status

# 9. Logları görüntüle
pm2 logs solvidaclean-api
```

## ✅ Adım 6: Test

### 1. Website Test:
- https://solvidaclean.com açılmalı

### 2. API Health Check:
- https://solvidaclean.com/api/health
- Şu cevabı görmelisiniz:
```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "..."
}
```

### 3. Admin Panel:
- https://solvidaclean.com/admin
- Login sayfası açılmalı

### 4. Email Test:
- Admin panelden bir quote açın
- Email gönderin
- Email'in gittiğini kontrol edin

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
- Browser console'da hataları kontrol edin

### SSH bağlanamıyorum:
- İyonos kontrol panelinde SSH erişiminin aktif olduğunu kontrol edin
- Port 22'nin açık olduğunu kontrol edin

## 📞 Sonraki Adımlar

1. ✅ Dosyaları FileZilla ile yükleyin
2. ✅ SSH ile server'a bağlanın
3. ✅ Server kurulumunu yapın
4. ✅ Test edin

Her adımda sorun olursa haber verin!

