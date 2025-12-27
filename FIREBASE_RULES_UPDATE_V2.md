# Firebase Rules Güncelleme - Appointments ve Settings İzni

## Mevcut Durum
Firestore rules'ında sadece `quotes` collection'ına izin var. `appointments` ve `appointmentSettings` collection'larına izin yok, bu yüzden:
- Appointment oluşturma çalışmıyor
- Time slot kaydetme çalışmıyor

## Güncellenmiş Rules

Firebase Console'dan aşağıdaki rules'ı deploy edin:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DEV-ONLY (geçici): sadece oturum açılmış kullanıcılar
    function isSignedIn() { return request.auth != null; }

    // Quotes collection - sadece signed in kullanıcılar
    match /quotes/{id} {
      allow read, write: if isSignedIn();
    }

    // Appointments collection - signed in kullanıcılar okuyup yazabilir
    // Ayrıca public appointment oluşturma için write izni (müşteriler login olmadan appointment oluşturabilir)
    match /appointments/{id} {
      allow read: if isSignedIn();
      allow create: if true; // Müşteriler appointment oluşturabilir (login olmadan)
      allow update, delete: if isSignedIn(); // Sadece admin güncelleyebilir/silebilir
    }

    // AppointmentSettings collection - sadece signed in kullanıcılar
    match /appointmentSettings/{id} {
      allow read, write: if isSignedIn();
    }

    // Diğer her şey kapalı
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Firebase Console'dan Güncelleme

1. **Firebase Console'a git**: https://console.firebase.google.com/
2. **Projeni seç**: `binoclean-admin`
3. **Firestore Database** → **Rules** sekmesine git
4. **Mevcut rules'ları sil** ve yukarıdaki rules'ı yapıştır
5. **Publish** butonuna tıkla

## Önemli Notlar

- **Appointments create**: Müşteriler login olmadan appointment oluşturabilir (public access)
- **Appointments read/update/delete**: Sadece admin (signed in) yapabilir
- **AppointmentSettings**: Sadece admin erişebilir
- **Quotes**: Sadece admin erişebilir

## Test Etme

Rules deploy edildikten sonra:
1. ✅ Appointment sayfasından yeni appointment oluştur (müşteri olarak, login olmadan)
2. ✅ Admin panelinden time slot'ları kaydet
3. ✅ Admin panelinden appointment'ları görüntüle ve güncelle

