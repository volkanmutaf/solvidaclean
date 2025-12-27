# Firebase Rules Güncelleme - Appointments İzni

## Sorun
Appointment oluşturulurken "Missing or insufficient permissions" hatası alınıyor.

## Çözüm
Firestore security rules'a `appointments` ve `appointmentSettings` collection'ları için izin eklendi.

## Firebase Console'dan Güncelleme

1. **Firebase Console'a git**: https://console.firebase.google.com/
2. **Projeni seç**
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
    
    // Allow read and write access to appointments collection
    match /appointments/{document} {
      allow read, write: if true;
    }
    
    // Allow read and write access to appointmentSettings collection
    match /appointmentSettings/{document} {
      allow read, write: if true;
    }
    
    // Allow read and write access to all collections for now (for development)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. **Publish** butonuna tıkla

## Firebase CLI ile Deploy

Eğer Firebase CLI kuruluysa:

```bash
firebase deploy --only firestore:rules
```

## Test Etme

Rules deploy edildikten sonra:
1. Appointment sayfasından yeni bir appointment oluştur
2. Hata olmadan oluşturulduğunu kontrol et
3. Admin panelinde appointment'ın göründüğünü kontrol et

## Not

Bu rules development için tüm collection'lara izin veriyor. Production'da daha sıkı security rules kullanılmalıdır.

