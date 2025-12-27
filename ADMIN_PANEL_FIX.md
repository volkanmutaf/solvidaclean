# 🔐 Admin Panel Sorun Giderme

## ✅ API Çalışıyor
API health check başarılı! Backend çalışıyor.

## 🔍 Admin Panel Sorunu

Admin panele giremiyorsanız, muhtemelen Firebase authentication sorunu var.

## 🔧 Çözüm Adımları

### 1. Firebase Console'da Authorized Domains Kontrolü

1. **Firebase Console'a gidin:**
   - https://console.firebase.google.com
   - Projenize gidin: `binoclean-admin`

2. **Authentication → Settings → Authorized domains**
   - Şu domain'leri ekleyin (yoksa):
     - `solvidaclean.com`
     - `www.solvidaclean.com`
     - `localhost` (development için)

### 2. Browser Console'da Hata Kontrolü

1. **Admin panel sayfasını açın:** https://solvidaclean.com/admin
2. **F12** tuşuna basın (Developer Tools)
3. **Console** sekmesine gidin
4. **Hataları kontrol edin:**
   - Firebase authentication hatası var mı?
   - CORS hatası var mı?
   - Network hatası var mı?

### 3. Admin Kullanıcı Kontrolü

Firebase Console'da admin kullanıcısı var mı kontrol edin:

1. **Firebase Console → Authentication → Users**
2. Admin email'iniz listede var mı?
3. Yoksa yeni kullanıcı oluşturun

### 4. Test

1. **Admin panel:** https://solvidaclean.com/admin
2. **Email ve şifre ile giriş yapmayı deneyin**
3. **Console'da hata var mı kontrol edin**

## 🐛 Yaygın Hatalar

### "auth/unauthorized-domain"
- **Çözüm:** Firebase Console'da authorized domains ekleyin

### "auth/user-not-found"
- **Çözüm:** Firebase Console'da kullanıcı oluşturun

### "auth/wrong-password"
- **Çözüm:** Şifreyi kontrol edin veya sıfırlayın

## 📝 Not

Browser console'da hangi hatayı görüyorsunuz? Hata mesajını paylaşın, daha spesifik çözüm sunabilirim.

