# Server Restart Notları

## Sorun
SMS gönderirken "Cannot POST /api/send_appointment_sms" hatası alınıyordu.

## Çözüm
Server yeniden başlatıldı. Endpoint zaten tanımlıydı ama server eski versiyonu çalıştırıyordu.

## Endpoint'ler

### Mevcut Endpoint'ler:
1. `POST /api/submit-quote` - Quote gönderme
2. `POST /api/send_quote_response` - Quote response email gönderme
3. `POST /api/send_appointment_confirmation` - Appointment confirmation email gönderme
4. `POST /api/send_quote_sms` - Quote SMS gönderme ✅
5. `POST /api/send_appointment_sms` - Appointment confirmation SMS gönderme ✅

## Server Başlatma

Server'ı başlatmak için:
```bash
npm run server
```

veya

```bash
cd server
node index.js
```

## Test

Server'ın çalıştığını kontrol etmek için:
```bash
netstat -ano | findstr :3001
```

Port 3001'de bir process görünmelidir.

## SMS Endpoint Test

SMS endpoint'ini test etmek için:
```bash
curl -X POST http://localhost:3001/api/send_appointment_sms \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentData": {
      "customerName": "Test User",
      "customerPhone": "+1234567890",
      "appointmentDate": "2025-01-15",
      "appointmentTime": "10:00",
      "quoteNumber": "Q2025-12345"
    }
  }'
```

## Notlar

- Server port 3001'de çalışıyor
- Twilio credentials `.env` dosyasında olmalı
- SMS göndermek için Twilio hesabı ve phone number gerekli

