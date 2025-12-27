# Email Gönderme Sorun Giderme Rehberi

## ✅ Test Sonucu
API key geçerli ve Resend çalışıyor! Test email başarıyla gönderildi.

## 🔍 Email Gelmeme Nedenleri

### 1. Spam Klasörünü Kontrol Edin
- Email spam/junk klasörüne düşmüş olabilir
- Gmail'de "Promotions" sekmesine bakın
- Outlook'ta "Junk Email" klasörünü kontrol edin

### 2. Resend Test Domain Kısıtlaması
Resend test domain'i (`onboarding@resend.dev`) ile:
- ✅ Bazı email sağlayıcılarına gönderilebilir
- ❌ Bazı email sağlayıcıları spam olarak işaretleyebilir
- ❌ Bazı email sağlayıcıları hiç kabul etmeyebilir

**Çözüm:** Resend Dashboard → Logs'dan email durumunu kontrol edin:
- https://resend.com/emails

### 3. Email Adresi Kontrolü
- Email adresinin doğru olduğundan emin olun
- Typo (yazım hatası) olabilir
- Email adresi geçerli bir formatta olmalı

### 4. Resend Dashboard Kontrolü
1. **Resend Dashboard'a giriş yapın:**
   - https://resend.com/login

2. **Logs sayfasına gidin:**
   - Dashboard → Logs
   - Veya direkt: https://resend.com/emails

3. **Email durumunu kontrol edin:**
   - ✅ **Delivered:** Email başarıyla gönderildi
   - ⚠️ **Bounced:** Email adresi geçersiz
   - ⚠️ **Complained:** Spam olarak işaretlenmiş
   - ⚠️ **Failed:** Gönderim başarısız

## 🧪 Test Email Gönderme

Test için özel bir email adresi kullanabilirsiniz:

```javascript
// Test email - her zaman çalışır
to: "delivered@resend.dev"
```

## 🔧 Server Loglarını Kontrol Etme

Server console'da şu mesajları görmelisiniz:

```
📨 Received email request: { to: '...', subject: '...', hasTemplateData: true }
📧 Sending email with Resend...
🔑 API Key status: Set (re_H1WGZDH...)
📬 To: customer@example.com
📝 Subject: Your Quote #Q2024-12345
✅ Email sent successfully!
📧 Email ID: abc123...
✅ Email sent successfully, result: { success: true, id: '...' }
```

Eğer hata görüyorsanız, hata mesajını not edin.

## 💡 Öneriler

### 1. Resend Dashboard'u Kontrol Edin
En önemli adım! Resend Dashboard'dan email durumunu kontrol edin:
- Email gönderildi mi?
- Bounce oldu mu?
- Spam olarak işaretlendi mi?

### 2. Farklı Email Adresleri Deneyin
- Gmail
- Outlook
- Yahoo
- Kendi domain'iniz

### 3. Production Domain Ekleyin
Test domain yerine kendi domain'inizi ekleyin:
1. Resend Dashboard → Domains
2. "Add Domain" butonuna tıklayın
3. Domain'inizi ekleyin ve DNS kayıtlarını yapın
4. `send_email.js` dosyasındaki `from` email'i güncelleyin

### 4. Email Template'i Test Edin
Email template'inin doğru oluşturulduğundan emin olun.

## 🚨 Hala Çalışmıyorsa

1. **Server console loglarını kontrol edin**
2. **Resend Dashboard → Logs'u kontrol edin**
3. **Farklı bir email adresi deneyin**
4. **Spam klasörünü kontrol edin**

## 📞 Destek

- **Resend Docs:** https://resend.com/docs
- **Resend Support:** https://resend.com/support

