# MailerSend Setup Guide

## "Unauthenticated" Hatası Çözümü

### 1. Server'ı Yeniden Başlatın
Server'ı durdurup yeniden başlatın ki .env dosyası yüklensin:

```bash
# Server'ı durdurun (Ctrl+C)
# Sonra tekrar başlatın:
npm run server
```

### 2. API Key Kontrolü

1. **MailerSend hesabınıza giriş yapın:**
   - https://www.mailersend.com/login

2. **API Keys sayfasına gidin:**
   - Dashboard → Settings → API Tokens

3. **Yeni API Key oluşturun (veya mevcut key'i kontrol edin):**
   - "Create Token" butonuna tıklayın
   - Token'a bir isim verin (örn: "Binoclean Production")
   - İzinleri seçin: "Email" izni olmalı
   - Token'ı kopyalayın

4. **.env dosyasını güncelleyin:**
   ```
   MAILERSEND_API_KEY=mlsn.your_new_api_key_here
   ```

5. **Server'ı yeniden başlatın**

### 3. Domain Doğrulaması

MailerSend'de email göndermek için domain doğrulaması gereklidir:

1. **MailerSend Dashboard → Domains**
2. **Domain ekleyin veya test domain kullanın:**
   - Test domain: `test-z0vklo67ky1l7qrx.mlsender.net` (zaten kullanılıyor)
   - Production için kendi domain'inizi ekleyin

3. **DNS kayıtlarını ekleyin** (production domain için)

### 4. Test Domain Kullanımı

Test domain (`test-z0vklo67ky1l7qrx.mlsender.net`) ile:
- ✅ Sadece MailerSend hesabınıza kayıtlı email adreslerine gönderebilirsiniz
- ❌ Herhangi bir email adresine gönderemezsiniz

**Test için:**
- MailerSend hesabınızdaki email adresini kullanın
- Veya MailerSend Dashboard → Domains → Test Domain → "Add Recipient" ile test email ekleyin

### 5. API Key Formatı

API key şu formatta olmalı:
```
mlsn.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 6. Debug

Server console'da şu mesajları görmelisiniz:
```
📧 Sending email with MailerSend...
🔑 API Key status: Set (mlsn.b1b29b...)
```

Eğer "NOT SET" görüyorsanız, .env dosyasını kontrol edin.

### 7. Alternatif: Resend Kullanımı

Eğer MailerSend sorunları devam ederse, Resend'e geçebiliriz:
- Ücretsiz plan: 3,000 email/ay
- Daha kolay setup
- Modern API

## Hızlı Test

1. Server'ı yeniden başlatın
2. Admin panelinde bir quote açın
3. Fiyat girin ve gönderin
4. Server console'da hata mesajlarını kontrol edin

