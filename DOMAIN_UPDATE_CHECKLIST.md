# Domain Doğrulama Kontrol Listesi - solvidaclean.com

## ✅ Yapılacaklar

### 1. Resend Dashboard
- [ ] https://resend.com/domains adresine gidin
- [ ] "Add Domain" butonuna tıklayın
- [ ] `solvidaclean.com` domain'ini ekleyin
- [ ] 3 DNS kaydını kopyalayın (TXT, MX, CNAME)

### 2. DNS Kayıtlarını Ekleme
- [ ] Domain sağlayıcınızın DNS ayarlarına gidin
- [ ] TXT kaydını ekleyin (Domain Verification)
- [ ] MX kaydını ekleyin (feedback-smtp.resend.com, Priority: 10)
- [ ] CNAME kaydını ekleyin (resend._domainkey)
- [ ] Kaydedin

### 3. DNS Yayılması
- [ ] 15-60 dakika bekleyin
- [ ] https://dnschecker.org/ ile DNS kayıtlarını kontrol edin
- [ ] Tüm kayıtların yayıldığını doğrulayın

### 4. Domain Doğrulaması
- [ ] Resend Dashboard → Domains sayfasına gidin
- [ ] Domain durumunu kontrol edin
- [ ] "Verify" butonuna tıklayın
- [ ] ✅ "Verified" göründüğünde hazırsınız!

### 5. Kod Güncellemesi (Otomatik - Ben yapacağım)
- [x] `server/send_email.js` dosyası güncellendi
- [x] `from: "SolVida Clean <info@solvidaclean.com>"` olarak ayarlandı

### 6. Server'ı Yeniden Başlatma
- [ ] Server'ı durdurun (Ctrl+C)
- [ ] Yeniden başlatın: `npm run server`

### 7. Test
- [ ] Admin panelinde bir quote açın
- [ ] Fiyat girin
- [ ] Email gönderin
- [ ] Herhangi bir email adresine gönderebildiğinizi doğrulayın

## 📧 Email Formatı

Domain doğrulandıktan sonra email'ler şu formatta gönderilecek:
```
From: SolVida Clean <info@solvidaclean.com>
```

## 🔧 Alternatif Email Adresleri

İsterseniz farklı email adresleri de kullanabilirsiniz:
- `info@solvidaclean.com` ✅ (Şu anki)
- `info@solvidaclean.com`
- `contact@solvidaclean.com`
- `quotes@solvidaclean.com`

## ⚠️ Önemli Notlar

1. **Domain doğrulaması tamamlanmadan email gönderemezsiniz**
2. **DNS yayılması 15-60 dakika sürebilir**
3. **Domain doğrulandıktan sonra server'ı yeniden başlatın**
4. **Test domain (`onboarding@resend.dev`) artık kullanılmayacak**

## 📞 Yardım

- **Resend Docs:** https://resend.com/docs
- **Resend Support:** https://resend.com/support
- **DNS Checker:** https://dnschecker.org/

