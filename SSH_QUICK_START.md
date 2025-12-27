# ⚡ SSH Hızlı Başlangıç

## ✅ SSH Yüklü!

SSH Windows'ta yüklü. Komutu doğru kullanmanız gerekiyor.

## 🔧 Doğru Komut

PowerShell veya Command Prompt'ta:

```powershell
ssh su48783@access-5019269728.webspace-host.com
```

**ÖNEMLİ**: Başına `ssh` yazmanız gerekiyor!

## 📝 Adım Adım

1. **PowerShell veya Command Prompt'u açın**
2. Şu komutu yazın:
   ```
   ssh su48783@access-5019269728.webspace-host.com
   ```
3. **Enter**'a basın
4. İlk bağlantıda şu mesajı göreceksiniz:
   ```
   The authenticity of host 'access-5019269728.webspace-host.com' can't be established.
   Are you sure you want to continue connecting (yes/no/[fingerprint])?
   ```
   **`yes`** yazın ve Enter'a basın
5. Şifre soracak:
   ```
   su48783@access-5019269728.webspace-host.com's password:
   ```
   Şifreyi yazın: `335241Vb!` (yazarken görünmeyecek, normal)
6. Enter'a basın
7. Bağlantı başarılı! Şu komutları çalıştırın:

## 🚀 Server'da Komutlar

```bash
# 1. Public klasörüne git
cd ~/public

# 2. Dosyaların yüklendiğini kontrol et
ls -la

# 3. .env dosyasının olduğunu kontrol et
ls -la .env

# 4. Dependencies yükle
npm install --production

# 5. PM2 yükle (process manager)
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

## 🎯 Özet

**Yanlış:**
```
su48783@access-5019269728.webspace-host.com
```

**Doğru:**
```
ssh su48783@access-5019269728.webspace-host.com
```

Başına `ssh` ekleyin! 🚀

