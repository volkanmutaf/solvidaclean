# 🚀 İyonos Deployment - Adım Adım Rehber

## ⚠️ ÖNEMLİ: Resend API Key
Resend API key'inizi almak için:
1. https://resend.com/login adresine gidin
2. Dashboard → API Keys
3. Yeni bir API key oluşturun veya mevcut key'i kopyalayın
4. Format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 📋 Adım 1: Production .env Dosyası Oluştur

Proje klasöründe `.env` dosyası oluşturun:

```env
RESEND_API_KEY=re_your_resend_api_key_here
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
PORT=3001
```

**ÖNEMLİ**: `re_your_resend_api_key_here` kısmını gerçek Resend API key'inizle değiştirin!

## 📦 Adım 2: Production Build

Terminal'de şu komutu çalıştırın:

```bash
npm run build
```

Bu komut `dist/` klasörünü oluşturacak. Build başarılı olduğunda "Build completed" mesajını göreceksiniz.

## 📤 Adım 3: SFTP ile Dosya Yükleme

### FileZilla ile Bağlantı:

1. **FileZilla'yı açın** (yoksa indirin: https://filezilla-project.org)

2. **Site Manager'ı açın**:
   - File → Site Manager → New Site
   - Site adı: "SolVida Clean Production"

3. **Bağlantı bilgilerini girin**:
   - **Host**: `access-5019269728.webspace-host.com`
   - **Port**: `22`
   - **Protocol**: `SFTP - SSH File Transfer Protocol`
   - **Logon Type**: `Normal`
   - **User**: `su48783`
   - **Password**: `335241Vb!`
   - **Connect** butonuna tıklayın

4. **Yüklenecek dosyalar**:
   - Sol tarafta (Local): Proje klasörünüz
   - Sağ tarafta (Remote): İyonos server'ınız
   
   **Yüklenecek klasörler ve dosyalar:**
   ```
   📁 dist/                    (TÜM İÇERİK)
   📁 server/                  (TÜM İÇERİK)
   📁 public/                  (TÜM İÇERİK)
   📄 package.json
   📄 package-lock.json
   📄 .env                     (Production environment variables)
   📄 ecosystem.config.js
   ```

5. **Dosyaları yükleyin**:
   - Sol taraftan dosyaları seçin
   - Sağ tarafa sürükleyip bırakın
   - Yükleme tamamlanana kadar bekleyin

**NOT**: `node_modules/` klasörünü YÜKLEMEYİN! Server'da `npm install` yapacaksınız.

## 🔧 Adım 4: Server'da Kurulum (SSH)

### SSH Bağlantısı:

İyonos'ta SSH erişimi varsa (kontrol panelinden kontrol edin):

1. **Terminal/PowerShell açın** ve şu komutu çalıştırın:
   ```bash
   ssh su48783@access-5019269728.webspace-host.com
   ```
   Şifre sorduğunda: `335241Vb!`

2. **Proje klasörüne gidin**:
   ```bash
   cd ~/public
   # veya İyonos'un belirttiği ana klasör
   ```

3. **Dependencies yükleyin**:
   ```bash
   npm install --production
   ```

4. **PM2 yükleyin** (process manager):
   ```bash
   npm install -g pm2
   ```

5. **Server'ı başlatın**:
   ```bash
   pm2 start ecosystem.config.js
   ```

6. **PM2'yi sistem başlangıcında otomatik başlat**:
   ```bash
   pm2 startup
   pm2 save
   ```

7. **Server durumunu kontrol edin**:
   ```bash
   pm2 status
   pm2 logs solvidaclean-api
   ```

## 🌐 Adım 5: Domain Yapılandırması

### İyonos Kontrol Panelinde:

1. **Domain ayarlarına** gidin
2. **DNS kayıtlarını** kontrol edin:
   - `A` kaydı: `@` → Server IP adresi
   - `CNAME` kaydı: `www` → `solvidaclean.com`

3. **SSL sertifikası** aktif mi kontrol edin (HTTPS için gerekli)

## ✅ Adım 6: Test

1. **Website'i açın**: https://solvidaclean.com
2. **API health check**: https://solvidaclean.com/api/health
3. **Admin panel**: https://solvidaclean.com/admin
4. **Quote form**: Test quote gönderin
5. **Email test**: Admin panelden bir quote'a email gönderin

## 🐛 Sorun Giderme

### Server başlamıyor:
```bash
pm2 logs solvidaclean-api
```

### Email gönderilmiyor:
- `.env` dosyasında `RESEND_API_KEY` kontrol edin
- Server loglarını kontrol edin: `pm2 logs`

### Frontend açılmıyor:
- `dist/` klasörünün doğru yerde olduğunu kontrol edin
- Browser console'da hataları kontrol edin

## 📞 İyonos'ta Node.js Yoksa?

Eğer İyonos'ta Node.js desteği yoksa, alternatif çözümler için `DEPLOYMENT.md` dosyasına bakın:
- **Frontend**: Vercel (ücretsiz)
- **Backend**: Railway veya Render (ücretsiz planlar mevcut)

