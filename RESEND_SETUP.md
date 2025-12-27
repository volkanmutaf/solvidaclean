# Resend Email Setup Guide

## 🚀 Hızlı Başlangıç

Resend modern ve kolay bir email servisi. MailerSend'den çok daha basit setup'ı var!

### 1. Resend Hesabı Oluşturun

1. **Resend'e kaydolun:**
   - https://resend.com/signup
   - Ücretsiz plan: **3,000 email/ay**

2. **Email doğrulayın:**
   - Kayıt sonrası email'inizi doğrulayın

### 2. API Key Alın

1. **Resend Dashboard'a giriş yapın:**
   - https://resend.com/login

2. **API Keys sayfasına gidin:**
   - Dashboard → API Keys
   - Veya direkt: https://resend.com/api-keys

3. **Yeni API Key oluşturun:**
   - "Create API Key" butonuna tıklayın
   - Key'e bir isim verin (örn: "Binoclean Production")
   - İzinleri seçin: "Sending access" olmalı
   - "Create" butonuna tıklayın
   - **ÖNEMLİ:** API key'i hemen kopyalayın (bir daha gösterilmez!)

4. **API Key formatı:**
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   `re_` ile başlar

### 3. .env Dosyasını Güncelleyin

`.env` dosyanıza Resend API key'i ekleyin:

```env
RESEND_API_KEY=re_your_api_key_here
```

**Örnek:**
```env
RESEND_API_KEY=re_AbCdEf1234567890XyZ
```

### 4. Server'ı Yeniden Başlatın

```bash
# Server'ı durdurun (Ctrl+C)
# Sonra tekrar başlatın:
npm run server
```

## 📧 Test Domain

Resend test için otomatik bir domain sağlar:
- **From email:** `onboarding@resend.dev`
- **Test için:** Herhangi bir email adresine gönderebilirsiniz
- **Production için:** Kendi domain'inizi ekleyin

### Production Domain Ekleme (İsteğe Bağlı)

1. **Resend Dashboard → Domains**
2. **"Add Domain" butonuna tıklayın**
3. **Domain'inizi girin** (örn: `binoclean.com`)
4. **DNS kayıtlarını ekleyin** (Resend size verir)
5. **Domain doğrulandıktan sonra** `send_email.js` dosyasındaki `from` email'i güncelleyin:
   ```javascript
   from: "Binoclean <noreply@binoclean.com>"
   ```

## ✅ Test Etme

1. Server'ı yeniden başlatın
2. Admin panelinde bir quote açın
3. Fiyat girin (örn: `$150`)
4. Email gönderin
5. Server console'da şu mesajları görmelisiniz:
   ```
   📧 Sending email with Resend...
   🔑 API Key status: Set (re_AbCdEf...)
   📬 To: customer@example.com
   📝 Subject: Your Quote #Q2024-12345
   ✅ Email sent successfully: abc123...
   ```

## 🎯 Avantajlar

- ✅ **Kolay Setup:** 5 dakikada hazır
- ✅ **Modern API:** Çok basit kullanım
- ✅ **Ücretsiz Plan:** 3,000 email/ay
- ✅ **Test Domain:** Hemen test edebilirsiniz
- ✅ **Güvenilir:** Modern altyapı
- ✅ **İyi Dokümantasyon:** https://resend.com/docs

## 🔧 Sorun Giderme

### "Unauthenticated" Hatası
- API key'in doğru kopyalandığından emin olun
- `.env` dosyasında `RESEND_API_KEY=re_...` formatında olmalı
- Server'ı yeniden başlatın

### "Invalid API key" Hatası
- Resend Dashboard'dan yeni bir API key oluşturun
- `.env` dosyasını güncelleyin
- Server'ı yeniden başlatın

### Email Gönderilmiyor
- Server console'da hata mesajlarını kontrol edin
- API key'in "Sending access" izni olduğundan emin olun
- Resend Dashboard → Logs'dan email durumunu kontrol edin

## 📚 Daha Fazla Bilgi

- **Resend Docs:** https://resend.com/docs
- **API Reference:** https://resend.com/docs/api-reference
- **Pricing:** https://resend.com/pricing

