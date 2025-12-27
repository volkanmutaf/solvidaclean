# Firebase Security Rules - Hızlı Kurulum

## Firebase Console ile Rules Deploy Etme

1. **Firebase Console'a git**: https://console.firebase.google.com/
2. **Projeni seç**: `binoclean-admin`
3. **Firestore Database** → **Rules** sekmesine git
4. **Mevcut rules'ları sil** ve aşağıdakileri yapıştır:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access to quotes collection
    match /quotes/{document} {
      allow read, write: if true;
    }
    
    // Default rule - deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. **Publish** butonuna tıkla

## Test Etme

Rules deploy edildikten sonra:
1. Server'ı restart et: `node server/index.js`
2. Quote form'dan test quote gönder
3. Admin dashboard'da görünüp görünmediğini kontrol et

## Sorun Giderme

Eğer hala çalışmıyorsa:
- Firebase Console'da Rules sekmesinde "Published" yazısını kontrol et
- Server console'unda Firebase error mesajlarını kontrol et
- Browser console'unda admin dashboard error'larını kontrol et
