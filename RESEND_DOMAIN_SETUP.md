# Resend Domain Doğrulama Rehberi

## 🚨 Sorun
Resend test domain'i (`onboarding@resend.dev`) ile sadece kendi email adresinize gönderebilirsiniz. Başka email adreslerine göndermek için domain doğrulaması yapmanız gerekiyor.

## ✅ Çözüm: Domain Doğrulama

### Adım 1: Resend Dashboard'a Giriş Yapın
1. https://resend.com/login adresine gidin
2. Hesabınıza giriş yapın

### Adım 2: Domain Ekleyin
1. **Dashboard → Domains** sayfasına gidin
   - Veya direkt: https://resend.com/domains
2. **"Add Domain"** butonuna tıklayın
3. **Domain'inizi girin:**
   - Örnek: `binoclean.com`
   - Veya subdomain: `mail.binoclean.com`
   - Veya test için: `test.binoclean.com`

### Adım 3: DNS Kayıtlarını Ekleyin
Resend size DNS kayıtlarını verecek. Domain sağlayıcınızın DNS ayarlarına eklemeniz gerekiyor:

**Örnek DNS kayıtları:**
```
Type: TXT
Name: @
Value: resend-verification=abc123...

Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
```

### Adım 4: DNS Kayıtlarını Ekleyin
1. **Domain sağlayıcınızın DNS ayarlarına gidin:**
   - GoDaddy, Namecheap, Cloudflare, vs.
2. **Resend'in verdiği DNS kayıtlarını ekleyin**
3. **Kaydet ve bekleyin** (5-30 dakika sürebilir)

### Adım 5: Domain Doğrulamasını Kontrol Edin
1. **Resend Dashboard → Domains** sayfasına gidin
2. **Domain durumunu kontrol edin:**
   - ✅ **Verified:** Domain doğrulandı, kullanıma hazır!
   - ⏳ **Pending:** DNS kayıtları henüz yayılmadı, bekleyin
   - ❌ **Failed:** DNS kayıtları yanlış, kontrol edin

### Adım 6: Kod Güncellemesi
Domain doğrulandıktan sonra `server/send_email.js` dosyasındaki `from` email'i güncelleyin:

```javascript
from: "Binoclean <noreply@binoclean.com>"
```

## 🎯 Hızlı Test (Geçici Çözüm)

Domain doğrulaması yapmadan önce test etmek isterseniz:

1. **Kendi email adresinize gönderin** (`mutaf@usa.com`)
2. **Email'i kontrol edin**
3. **Template'in doğru çalıştığını doğrulayın**

## 💡 Alternatif: Subdomain Kullanın

Eğer ana domain'inizi kullanmak istemiyorsanız, subdomain kullanabilirsiniz:
- `mail.binoclean.com`
- `noreply.binoclean.com`
- `email.binoclean.com`

## 📝 Notlar

- **DNS yayılması:** 5-30 dakika sürebilir
- **Domain doğrulaması:** Bir kez yapılır, sonra süresiz kullanılır
- **Ücretsiz plan:** Domain doğrulaması ücretsizdir
- **Test domain:** Domain doğrulaması yapmadan test edemezsiniz

## 🔧 Domain Doğrulaması Sonrası

Domain doğrulandıktan sonra:
1. `server/send_email.js` dosyasını güncelleyin
2. Server'ı yeniden başlatın
3. Herhangi bir email adresine gönderebilirsiniz!

