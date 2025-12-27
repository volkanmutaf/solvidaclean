# 📥 WinSCP Kurulum ve Kullanım Rehberi

## 1️⃣ WinSCP İndirme

1. **WinSCP'yi indirin:**
   - https://winscp.net/eng/download.php
   - Veya direkt: https://winscp.net/eng/downloads.php
   - **"Download WinSCP"** butonuna tıklayın
   - İndirilen `.exe` dosyasını çalıştırın

## 2️⃣ WinSCP Kurulumu

1. **Kurulum sihirbazını başlatın**
2. **"Next"** butonlarına tıklayın
3. **ÖNEMLİ:** Kurulum sırasında şu seçeneği işaretleyin:
   - ✅ **"Install .NET assembly for use from PowerShell"** veya
   - ✅ **"Install .NET assembly"**
4. Kurulumu tamamlayın

## 3️⃣ PowerShell Script'i Çalıştırma

WinSCP kurulduktan sonra:

1. **PowerShell'i açın** (Administrator olarak açmanız gerekebilir)

2. **Proje klasörüne gidin:**
   ```powershell
   cd D:\Users\Vol\Desktop\BC\binoclean
   ```

3. **Script'i çalıştırın:**
   ```powershell
   .\deploy-to-ionos.ps1
   ```

Script otomatik olarak:
- ✅ Server'a bağlanacak
- ✅ Tüm dosyaları yükleyecek
- ✅ .env dosyasını oluşturacak

## 4️⃣ Script Çalışmazsa

Eğer script hata verirse:

### Hata: "WinSCPnet.dll bulunamadı"
- WinSCP'yi yeniden kurun
- Kurulum sırasında ".NET assembly" seçeneğini işaretleyin
- Veya manuel olarak FileZilla kullanın

### Hata: "Execution Policy"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Alternatif: WinSCP GUI Kullanımı

WinSCP'yi GUI olarak da kullanabilirsiniz:

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

## 5️⃣ Dosyalar Yüklendikten Sonra

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

