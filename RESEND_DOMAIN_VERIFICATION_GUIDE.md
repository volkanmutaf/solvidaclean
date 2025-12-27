# Resend Domain Doğrulama Rehberi - Adım Adım

## 🎯 Amaç
Domain doğrulaması yaparak Resend test domain'i yerine kendi domain'inizi kullanabilirsiniz. Böylece herhangi bir email adresine gönderebilirsiniz.

## 📋 Adım 1: Resend Dashboard'a Giriş

1. **Resend hesabınıza giriş yapın:**
   - https://resend.com/login
   - GitHub ile giriş yapabilirsiniz

2. **Domains sayfasına gidin:**
   - Sol menüden **"Domains"** seçin
   - Veya direkt: https://resend.com/domains

## 📋 Adım 2: Domain Ekleme

1. **"Add Domain" butonuna tıklayın**

2. **Domain'inizi girin:**
   - Örnek: `binoclean.com`
   - Veya subdomain: `mail.binoclean.com` veya `noreply.binoclean.com`
   - **Not:** Subdomain kullanmanızı öneririm (daha kolay ve güvenli)

3. **"Add" butonuna tıklayın**

## 📋 Adım 3: DNS Kayıtlarını Alma

Resend size 3 DNS kaydı verecek:

### 1. TXT Kaydı (Domain Verification)
```
Type: TXT
Name: @ (veya domain adı)
Value: resend-verification=abc123xyz...
TTL: 3600 (veya otomatik)
```

### 2. MX Kaydı (Email Delivery)
```
Type: MX
Name: @ (veya domain adı)
Value: feedback-smtp.resend.com
Priority: 10
TTL: 3600 (veya otomatik)
```

### 3. CNAME Kaydı (DKIM - Email Authentication)
```
Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
TTL: 3600 (veya otomatik)
```

## 📋 Adım 4: DNS Kayıtlarını Domain Sağlayıcınıza Ekleme

### GoDaddy için:
1. GoDaddy hesabınıza giriş yapın
2. **"My Products"** → **"DNS"** seçin
3. Domain'inizi seçin
4. **"Records"** sekmesine gidin
5. Her bir kaydı ekleyin:
   - **TXT kaydı:** "Add" → Type: TXT, Name: @, Value: resend-verification=...
   - **MX kaydı:** "Add" → Type: MX, Name: @, Value: feedback-smtp.resend.com, Priority: 10
   - **CNAME kaydı:** "Add" → Type: CNAME, Name: resend._domainkey, Value: resend._domainkey.resend.com

### Namecheap için:
1. Namecheap hesabınıza giriş yapın
2. **"Domain List"** → Domain'inizi seçin
3. **"Advanced DNS"** sekmesine gidin
4. Her bir kaydı ekleyin (yukarıdaki gibi)

### Cloudflare için:
1. Cloudflare hesabınıza giriş yapın
2. Domain'inizi seçin
3. **"DNS"** sekmesine gidin
4. Her bir kaydı ekleyin:
   - **TXT:** Type: TXT, Name: @, Content: resend-verification=...
   - **MX:** Type: MX, Name: @, Mail server: feedback-smtp.resend.com, Priority: 10
   - **CNAME:** Type: CNAME, Name: resend._domainkey, Target: resend._domainkey.resend.com

### Diğer Domain Sağlayıcıları:
- DNS ayarlarına gidin
- Yukarıdaki 3 kaydı ekleyin
- Format aynı, sadece arayüz farklı olabilir

## 📋 Adım 5: DNS Yayılmasını Bekleme

1. **DNS kayıtlarını ekledikten sonra:**
   - Yayılma süresi: **5 dakika - 48 saat** (genellikle 15-30 dakika)
   - Cloudflare: Genellikle çok hızlı (1-5 dakika)
   - GoDaddy/Namecheap: 15-60 dakika

2. **Yayılmayı kontrol etmek için:**
   - https://dnschecker.org/ adresine gidin
   - Domain'inizi ve kayıt tipini seçin
   - Dünya genelinde yayılıp yayılmadığını kontrol edin

## 📋 Adım 6: Domain Doğrulamasını Kontrol Etme

1. **Resend Dashboard → Domains** sayfasına gidin
2. **Domain durumunu kontrol edin:**
   - ✅ **Verified (Yeşil):** Domain doğrulandı, kullanıma hazır!
   - ⏳ **Pending (Sarı):** DNS kayıtları henüz yayılmadı, bekleyin
   - ❌ **Failed (Kırmızı):** DNS kayıtları yanlış, kontrol edin

3. **"Verify" butonuna tıklayın** (eğer otomatik doğrulanmadıysa)

## 📋 Adım 7: Kod Güncellemesi

Domain doğrulandıktan sonra `server/send_email.js` dosyasını güncelleyin:

### Önce (Test Domain):
```javascript
from: "Binoclean <onboarding@resend.dev>"
```

### Sonra (Kendi Domain'iniz):
```javascript
from: "Binoclean <noreply@binoclean.com>"
```

Veya subdomain kullandıysanız:
```javascript
from: "Binoclean <noreply@mail.binoclean.com>"
```

## 📋 Adım 8: Server'ı Yeniden Başlatma

1. Server'ı durdurun (Ctrl+C)
2. Yeniden başlatın:
   ```bash
   npm run server
   ```

## ✅ Test Etme

1. Admin panelinde bir quote açın
2. Fiyat girin
3. Email gönderin
4. Artık **herhangi bir email adresine** gönderebilirsiniz!

## 🔧 Sorun Giderme

### Domain "Pending" Durumunda Kalıyorsa:
1. DNS kayıtlarının doğru eklendiğinden emin olun
2. DNS yayılmasını bekleyin (48 saate kadar sürebilir)
3. Resend Dashboard'da "Verify" butonuna tekrar tıklayın

### DNS Kayıtları Görünmüyorsa:
1. DNS checker ile kontrol edin: https://dnschecker.org/
2. Domain sağlayıcınızın DNS ayarlarını kontrol edin
3. TTL değerini düşürün (3600 → 300)

### "Failed" Durumunda:
1. DNS kayıtlarını tekrar kontrol edin
2. Typo (yazım hatası) olup olmadığını kontrol edin
3. Resend Dashboard'daki kayıtları tekrar kopyalayın

## 💡 İpuçları

1. **Subdomain kullanın:** `mail.binoclean.com` gibi subdomain kullanmak daha güvenli ve kolaydır
2. **Cloudflare kullanın:** DNS yayılması çok hızlıdır
3. **TTL değerini düşürün:** Test sırasında TTL'i 300 yapın, sonra 3600'e çıkarın
4. **SPF kaydı ekleyin (isteğe bağlı):** Email deliverability için SPF kaydı da ekleyebilirsiniz

## 📞 Destek

- **Resend Docs:** https://resend.com/docs
- **Resend Support:** https://resend.com/support
- **DNS Checker:** https://dnschecker.org/

## 🎯 Hızlı Özet

1. ✅ Resend Dashboard → Domains → Add Domain
2. ✅ Domain'inizi girin
3. ✅ 3 DNS kaydını alın (TXT, MX, CNAME)
4. ✅ Domain sağlayıcınıza DNS kayıtlarını ekleyin
5. ✅ 15-60 dakika bekleyin
6. ✅ Resend Dashboard'da "Verify" butonuna tıklayın
7. ✅ `send_email.js` dosyasını güncelleyin
8. ✅ Server'ı yeniden başlatın
9. ✅ Test edin!

