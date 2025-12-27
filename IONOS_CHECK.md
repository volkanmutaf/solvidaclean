# 🔍 İyonos Kontrol Paneli Kontrolü

## ⚡ En Kolay Yol: İyonos Kontrol Paneli

İyonos kontrol panelinde Node.js desteği varsa, SFTP ile dosya yükleyip kontrol panelinden başlatabiliriz!

## 📋 Kontrol Adımları

### 1. İyonos Kontrol Paneline Giriş Yapın
- https://www.ionos.com/login
- Hosting hesabınıza giriş yapın

### 2. Node.js Desteğini Kontrol Edin

Kontrol panelinde şunları arayın:
- **"Node.js"** veya **"Applications"** bölümü
- **"Websites & Domains"** → **"Node.js"**
- **"Hosting"** → **"Node.js Applications"**
- **"Application Manager"**

### 3. Node.js Varsa:

#### A) Yeni Node.js Uygulaması Oluşturun:
1. **Node.js** bölümüne gidin
2. **"Create Application"** veya **"Add Application"**
3. Ayarları yapın:
   - **Application Name:** `solvidaclean-api`
   - **Node.js Version:** En son versiyon (18.x veya 20.x)
   - **Application Root:** `public`
   - **Startup File:** `server/index.js`
   - **Working Directory:** `public`

#### B) Environment Variables Ekleyin:
```
RESEND_API_KEY=re_H1WGZDH9_EoaZfh1PGWkBwJfWcHW1t4u6
WEBSITE_URL=https://solvidaclean.com
NODE_ENV=production
PORT=3001
```

#### C) Dosyaları SFTP ile Yükleyin:
- FileZilla ile bağlanın
- Tüm dosyaları `public/` klasörüne yükleyin
- `npm install` otomatik çalışacak (veya kontrol panelinden çalıştırın)

#### D) Uygulamayı Başlatın:
- Kontrol panelinden **"Start"** veya **"Deploy"** butonuna tıklayın

## ✅ Avantajlar

- ✅ Tek bir hosting'de her şey
- ✅ SFTP ile kolay dosya yükleme
- ✅ Kontrol panelinden yönetim
- ✅ Ücretsiz (mevcut hosting içinde)

## ❌ Node.js Yoksa:

Railway kullanmamız gerekecek (5 dakika):
- https://railway.app
- GitHub repo bağla
- Backend'i deploy et
- Frontend'de API URL'i güncelle

## 🎯 Öneri

**Önce İyonos kontrol panelini kontrol edin:**
1. Node.js var mı?
2. Varsa → İyonos'ta devam edin (en kolay)
3. Yoksa → Railway kullanın (5 dakika)

Hangi durumda olduğunuzu bana söyleyin, ona göre devam edelim!

