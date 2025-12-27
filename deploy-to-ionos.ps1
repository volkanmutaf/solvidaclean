# SolVida Clean - İyonos Otomatik Deployment Script
# PowerShell ile SFTP upload

param(
    [string]$Host = "access-5019269728.webspace-host.com",
    [string]$User = "su48783",
    [string]$Password = "Volcano2135$$",
    [int]$Port = 22
)

Write-Host "🚀 SolVida Clean - İyonos Deployment Başlıyor..." -ForegroundColor Green
Write-Host ""

# WinSCP .NET Assembly kullanarak SFTP bağlantısı
$ErrorActionPreference = "Stop"

try {
    # WinSCP .NET Assembly yükle (eğer yoksa)
    $possiblePaths = @(
        "$env:ProgramFiles\WinSCP\WinSCPnet.dll",
        "${env:ProgramFiles(x86)}\WinSCP\WinSCPnet.dll",
        "$env:ProgramFiles\WinSCP\WinSCPnet.dll"
    )
    
    $winSCPPath = $null
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $winSCPPath = $path
            break
        }
    }
    
    if (-not $winSCPPath) {
        Write-Host "❌ WinSCP .NET Assembly bulunamadı!" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Çözüm:" -ForegroundColor Yellow
        Write-Host "   1. WinSCP'yi yeniden kurun" -ForegroundColor Cyan
        Write-Host "   2. Kurulum sırasında 'Install .NET assembly' seçeneğini işaretleyin" -ForegroundColor Cyan
        Write-Host "   3. Veya FileZilla ile manuel yükleme yapın" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📥 WinSCP: https://winscp.net/eng/download.php" -ForegroundColor Yellow
        exit 1
    }
    
    # WinSCP Assembly'yi yükle
    Add-Type -Path $winSCPPath
    
    # SFTP bağlantı ayarları
    $sessionOptions = New-Object WinSCP.SessionOptions
    $sessionOptions.Protocol = [WinSCP.Protocol]::Sftp
    $sessionOptions.HostName = $Host
    $sessionOptions.PortNumber = $Port
    $sessionOptions.UserName = $User
    $sessionOptions.Password = $Password
    $sessionOptions.SshHostKeyFingerprint = "ssh-rsa 2048 xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx"
    
    Write-Host "📡 Server'a bağlanılıyor..." -ForegroundColor Cyan
    $session = New-Object WinSCP.Session
    
    try {
        $session.Open($sessionOptions)
        Write-Host "✅ Bağlantı başarılı!" -ForegroundColor Green
        Write-Host ""
        
        # Yüklenecek dosyalar
        $localPath = $PSScriptRoot
        $remotePath = "/public"
        
        Write-Host "📁 Dosyalar yükleniyor..." -ForegroundColor Cyan
        
        # 1. dist/ klasörü içeriği
        Write-Host "  📦 dist/ klasörü yükleniyor..." -ForegroundColor Yellow
        $transferOptions = New-Object WinSCP.TransferOptions
        $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary
        $session.PutFiles("$localPath\dist\*", "$remotePath/", $False, $transferOptions)
        Write-Host "  ✅ dist/ yüklendi" -ForegroundColor Green
        
        # 2. server/ klasörü
        Write-Host "  📦 server/ klasörü yükleniyor..." -ForegroundColor Yellow
        $session.PutFiles("$localPath\server\*", "$remotePath/server/", $False, $transferOptions)
        Write-Host "  ✅ server/ yüklendi" -ForegroundColor Green
        
        # 3. public/ klasörü (images, services, vb.)
        Write-Host "  📦 public/ klasörü yükleniyor..." -ForegroundColor Yellow
        $session.PutFiles("$localPath\public\*", "$remotePath/", $False, $transferOptions)
        Write-Host "  ✅ public/ yüklendi" -ForegroundColor Green
        
        # 4. Config dosyaları
        Write-Host "  📦 Config dosyaları yükleniyor..." -ForegroundColor Yellow
        $session.PutFiles("$localPath\package.json", "$remotePath/", $False, $transferOptions)
        $session.PutFiles("$localPath\package-lock.json", "$remotePath/", $False, $transferOptions)
        $session.PutFiles("$localPath\ecosystem.config.js", "$remotePath/", $False, $transferOptions)
        
        # .env.production -> .env
        if (Test-Path "$localPath\.env.production") {
            $session.PutFiles("$localPath\.env.production", "$remotePath/.env", $False, $transferOptions)
            Write-Host "  ✅ .env dosyası yüklendi" -ForegroundColor Green
        }
        
        Write-Host "  ✅ Config dosyaları yüklendi" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "✅ Tüm dosyalar başarıyla yüklendi!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔧 Şimdi SSH ile server'a bağlanıp kurulum yapın:" -ForegroundColor Cyan
        Write-Host "   ssh $User@$Host" -ForegroundColor Yellow
        Write-Host "   cd ~/public" -ForegroundColor Yellow
        Write-Host "   npm install --production" -ForegroundColor Yellow
        Write-Host "   npm install -g pm2" -ForegroundColor Yellow
        Write-Host "   pm2 start ecosystem.config.js" -ForegroundColor Yellow
        
    } finally {
        $session.Dispose()
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Hata oluştu: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternatif: FileZilla ile manuel yükleme yapabilirsiniz:" -ForegroundColor Yellow
    Write-Host "   Host: $Host" -ForegroundColor Cyan
    Write-Host "   Port: $Port" -ForegroundColor Cyan
    Write-Host "   User: $User" -ForegroundColor Cyan
    Write-Host "   Password: $Password" -ForegroundColor Cyan
    exit 1
}

