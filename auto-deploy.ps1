# SolVida Clean - Basit Otomatik Deployment
# PSCP (PuTTY SCP) kullanarak

$hostname = "access-5019269728.webspace-host.com"
$username = "su48783"
$password = "Volcano2135$$"
$remotePath = "/public"

Write-Host "🚀 SolVida Clean - Otomatik Deployment" -ForegroundColor Green
Write-Host ""

# PSCP kontrolü
$pscpPath = "pscp.exe"
if (-not (Get-Command $pscpPath -ErrorAction SilentlyContinue)) {
    Write-Host "❌ PSCP bulunamadı!" -ForegroundColor Red
    Write-Host "📥 PuTTY'yi indirin: https://www.putty.org/" -ForegroundColor Yellow
    Write-Host "   PSCP: https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Alternatif: deploy-to-ionos.ps1 script'ini kullanın (WinSCP gerekir)" -ForegroundColor Cyan
    exit 1
}

Write-Host "📡 Dosyalar yükleniyor..." -ForegroundColor Cyan

# Yüklenecek dosyalar
$filesToUpload = @(
    "dist",
    "server",
    "public",
    "package.json",
    "package-lock.json",
    "ecosystem.config.js",
    ".env.production"
)

foreach ($file in $filesToUpload) {
    if (Test-Path $file) {
        Write-Host "  📦 $file yükleniyor..." -ForegroundColor Yellow
        
        if (Test-Path $file -PathType Container) {
            # Klasör ise
            & $pscpPath -r -pw $password "$file" "$username@${hostname}:$remotePath/"
        } else {
            # Dosya ise
            & $pscpPath -pw $password "$file" "$username@${hostname}:$remotePath/"
        }
        
        Write-Host "  ✅ $file yüklendi" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $file bulunamadı, atlanıyor..." -ForegroundColor Yellow
    }
}

# .env.production -> .env
Write-Host "  📝 .env dosyası oluşturuluyor..." -ForegroundColor Yellow
& $pscpPath -pw $password ".env.production" "$username@${hostname}:$remotePath/.env"
Write-Host "  ✅ .env dosyası oluşturuldu" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Dosya yükleme tamamlandı!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Şimdi SSH ile server'a bağlanıp kurulum yapın:" -ForegroundColor Cyan
Write-Host "   ssh $username@$hostname" -ForegroundColor Yellow
Write-Host "   cd ~/public" -ForegroundColor Yellow
Write-Host "   npm install --production" -ForegroundColor Yellow
Write-Host "   npm install -g pm2" -ForegroundColor Yellow
Write-Host "   pm2 start ecosystem.config.js" -ForegroundColor Yellow
Write-Host "   pm2 startup" -ForegroundColor Yellow
Write-Host "   pm2 save" -ForegroundColor Yellow

