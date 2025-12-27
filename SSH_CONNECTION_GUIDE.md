# 🔌 SSH Bağlantı Rehberi - Windows

## Problem
Windows PowerShell'de `ssh` komutu çalışmıyor.

## Çözüm Seçenekleri

### Seçenek 1: OpenSSH Yükleme (Önerilen)

Windows 10/11'de OpenSSH genellikle yüklü gelir ama aktif olmayabilir.

#### Kontrol:
```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
```

#### Yükleme:
```powershell
# Administrator olarak PowerShell açın (sağ tık → Run as Administrator)
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

#### Bağlantı:
```powershell
ssh su48783@access-5019269728.webspace-host.com
# Şifre: 335241Vb!
```

---

### Seçenek 2: PuTTY Kullan (Kolay)

PuTTY Windows'ta en popüler SSH client.

#### 1. PuTTY İndir:
- https://www.putty.org/ veya https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
- `putty.exe` dosyasını indirin

#### 2. PuTTY ile Bağlan:
1. PuTTY'yi açın
2. **Host Name**: `access-5019269728.webspace-host.com`
3. **Port**: `22`
4. **Connection type**: `SSH` (seçili olmalı)
5. **Open** butonuna tıklayın
6. İlk bağlantıda "Security Alert" çıkarsa **Yes** deyin
7. Username: `su48783`
8. Password: `335241Vb!`

#### 3. PuTTY'de Komutlar:
Bağlandıktan sonra normal terminal gibi komutları çalıştırabilirsiniz:
```bash
cd ~/public
ls -la
npm install --production
```

---

### Seçenek 3: Windows Terminal + OpenSSH

Windows Terminal kullanarak:

1. **Windows Terminal**'i açın (Microsoft Store'dan indirebilirsiniz)
2. Yeni bir tab açın
3. Şu komutu çalıştırın:
```powershell
ssh su48783@access-5019269728.webspace-host.com
```

---

### Seçenek 4: WSL (Windows Subsystem for Linux)

WSL yüklüyse:

1. WSL'i açın (Ubuntu, vb.)
2. Normal SSH komutunu kullanın:
```bash
ssh su48783@access-5019269728.webspace-host.com
```

---

## 🎯 Hızlı Çözüm: PuTTY

En kolay yöntem **PuTTY** kullanmak:

1. **PuTTY İndir**: https://www.putty.org/
2. **Aç** ve bağlan:
   - Host: `access-5019269728.webspace-host.com`
   - Port: `22`
   - Username: `su48783`
   - Password: `335241Vb!`

---

## ✅ Bağlantı Başarılı Olduğunda

Server'a bağlandıktan sonra şu komutları çalıştırın:

```bash
# 1. Public klasörüne git
cd ~/public

# 2. Dosyaların yüklendiğini kontrol et
ls -la

# 3. .env dosyasının olduğunu kontrol et
ls -la .env

# 4. Dependencies yükle
npm install --production

# 5. PM2 yükle
npm install -g pm2

# 6. Server'ı başlat
pm2 start ecosystem.config.js

# 7. Otomatik başlatma
pm2 startup
# (Çıkan komutu kopyalayıp çalıştırın)

pm2 save

# 8. Durum kontrol
pm2 status
pm2 logs solvidaclean-api
```

---

## 🆘 Hala Bağlanamıyorsanız

1. **İyonos kontrol panelinde** SSH erişiminin aktif olduğunu kontrol edin
2. **Firewall** ayarlarını kontrol edin
3. **Port 22**'nin açık olduğunu kontrol edin
4. İyonos destek ekibiyle iletişime geçin

---

## 📝 Not

SSH bağlantısı yapamazsanız, **FileZilla ile dosyaları yükleyip** server kurulumunu İyonos kontrol panelinden yapabilirsiniz (eğer varsa).

