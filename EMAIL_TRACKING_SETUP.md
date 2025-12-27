# Email Tracking ve SMS Sistemi Kurulumu

## ✅ Yapılan Değişiklikler

### 1. Email Tracking (Firestore)
- Email gönderildiğinde `emailLogs` collection'ına kayıt ekleniyor
- Her email için: type, to, emailId, status, createdAt bilgileri saklanıyor
- Admin panelinde email log'larını görüntüleyebilirsiniz

### 2. SMS Sistemi (Twilio)
- Twilio entegrasyonu eklendi
- Appointment confirm edildiğinde hem email hem SMS gönderiliyor
- SMS mesajı appointment detaylarını içeriyor

### 3. Resend API Entegrasyonu
- Email gönderildiğinde Resend email ID'si kaydediliyor
- Email log'ları Firestore'da saklanıyor
- Resend Dashboard'dan email durumunu kontrol edebilirsiniz

## 📧 Email Takibi

### Resend Dashboard'dan Kontrol
1. **Resend Dashboard'a gidin**: https://resend.com/emails
2. **Logs sayfasına gidin**: Dashboard → Logs
3. **Email'i bulun**: Email ID veya recipient ile arayın
4. **Durumu kontrol edin**:
   - ✅ **Delivered**: Email gönderildi
   - ⚠️ **Bounced**: Email adresi geçersiz
   - ⚠️ **Complained**: Spam olarak işaretlenmiş
   - ⚠️ **Opened**: Email açıldı mı?

### Firestore'dan Kontrol
- `emailLogs` collection'ında tüm gönderilen email'ler kayıtlı
- Admin panelinde email log'larını görüntüleyebilirsiniz (yakında eklenecek)

## 📱 SMS Sistemi Kurulumu

### 1. Twilio Hesabı Oluşturma
1. **Twilio'ya kaydolun**: https://www.twilio.com/try-twilio
2. **Phone Number alın**: Twilio Console → Phone Numbers → Buy a Number
3. **Credentials alın**: Account SID ve Auth Token

### 2. Environment Variables Ekleme
`.env` dosyasına ekleyin:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Twilio Paketini Yükleyin
```bash
npm install twilio
```

### 4. Test
Appointment confirm edildiğinde:
- ✅ Email gönderilecek
- ✅ SMS gönderilecek (eğer phone number varsa)

## 🔍 Email Neden Gitmedi?

### Kontrol Listesi:
1. **Server console'u kontrol edin**:
   - "📨 Sending appointment confirmation email" mesajını görüyor musunuz?
   - "✅ Appointment confirmation email sent" mesajını görüyor musunuz?
   - Hata mesajı var mı?

2. **Resend Dashboard'u kontrol edin**:
   - https://resend.com/emails
   - Email gönderildi mi?
   - Status nedir? (Delivered, Bounced, etc.)

3. **Spam klasörünü kontrol edin**:
   - Email spam/junk klasörüne düşmüş olabilir

4. **Email adresini kontrol edin**:
   - Email adresi doğru mu?
   - Typo var mı?

## 📊 Email Log'larını Görüntüleme

### Firestore'da:
- Collection: `emailLogs`
- Fields:
  - `type`: "appointment_confirmation" veya "quote_response"
  - `to`: Email adresi
  - `emailId`: Resend email ID
  - `status`: "sent", "delivered", "bounced", etc.
  - `createdAt`: Gönderim zamanı

### Admin Panelinde (Yakında):
- Email log'larını görüntüleyebileceksiniz
- Email durumunu kontrol edebileceksiniz
- Resend Dashboard'a direkt link

## 💡 İpuçları

1. **Email gönderimi başarısız olursa**:
   - Server console'daki hata mesajını kontrol edin
   - Resend Dashboard'dan email durumunu kontrol edin
   - Email adresinin geçerli olduğundan emin olun

2. **SMS gönderimi başarısız olursa**:
   - Twilio credentials'ların doğru olduğundan emin olun
   - Phone number'ın E.164 formatında olduğundan emin olun (+1234567890)
   - Twilio Console'dan SMS log'larını kontrol edin

3. **Email tracking için**:
   - Resend Dashboard'u düzenli kontrol edin
   - Firestore emailLogs collection'ını kontrol edin
   - Email bounce rate'ini takip edin

## 🚀 Sonraki Adımlar

1. **Admin Panel Email Log Sayfası**:
   - Email log'larını görüntüleyen bir sayfa ekleyin
   - Resend Dashboard'a direkt link
   - Email durumunu göster

2. **Resend Webhooks**:
   - Email durumu değiştiğinde otomatik güncelleme
   - Bounce, complaint, open tracking

3. **SMS Tracking**:
   - SMS log'larını Firestore'da sakla
   - SMS durumunu takip et

