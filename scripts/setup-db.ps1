<#
setup-db.ps1

Usage: Run this script from the repo root in PowerShell:
  .\scripts\setup-db.ps1

What it does:
  - Prompts for a MySQL admin username and password
  - Parses `backend/.env` to get DATABASE_URL and extracts DB name/user/password/host
  - Connects to MySQL as the admin user and creates the database and app user (if needed)
  - Installs backend dependencies, runs Prisma generate, migrate, and runs seed script

NOTE: This script assumes a local MySQL server is reachable at the host in the DATABASE_URL.
#>

$ErrorActionPreference = 'Stop'

function Read-SecureStringAsPlainText([System.Security.SecureString]$s) {
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) } finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

Write-Host "Checking prerequisites..." -ForegroundColor Cyan
if (-not (Get-Command mysql -ErrorAction SilentlyContinue)) {
    Write-Error "mysql client not found in PATH. Install MySQL client or add it to PATH and re-run."
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm not found in PATH. Install Node.js and npm and re-run."
    exit 1
}

# Prompt for admin credentials
$adminUser = Read-Host "MySQL admin user (default: root)"
if ([string]::IsNullOrWhiteSpace($adminUser)) { $adminUser = 'root' }
$adminPwdSecure = Read-Host "MySQL admin password (will be hidden)" -AsSecureString
$adminPwd = Read-SecureStringAsPlainText $adminPwdSecure

# Parse backend/.env
$envPath = Join-Path -Path (Get-Location) -ChildPath "backend\.env"
if (-not (Test-Path $envPath)) { Write-Error "backend/.env not found at $envPath"; exit 1 }
$envContent = Get-Content $envPath | Where-Object { $_ -match '^\s*DATABASE_URL' }
if (-not $envContent) { Write-Error "DATABASE_URL not found in backend/.env"; exit 1 }

# Extract URL value between quotes if present
if ($envContent -match 'DATABASE_URL\s*=\s*"?([^"\s]+)"?') { $dbUrl = $matches[1] } else { Write-Error "Failed to parse DATABASE_URL"; exit 1 }

# Parse mysql://user:pass@host:port/dbname
$regex = [regex]'mysql:\/\/(?<user>[^:]+):(?<pass>[^@]+)@(?<host>[^:\/]+)(:(?<port>\d+))?\/(?<db>[^\s]+)'
$match = $regex.Match($dbUrl)
if (-not $match.Success) { Write-Error "DATABASE_URL is not in expected format mysql://user:pass@host:port/dbname"; exit 1 }
$appUser = $match.Groups['user'].Value
$appPass = $match.Groups['pass'].Value
$dbHost  = $match.Groups['host'].Value
$dbPort  = $match.Groups['port'].Value
$dbName  = $match.Groups['db'].Value
if (-not $dbPort) { $dbPort = 3306 }

Write-Host "Parsed DB settings:" -ForegroundColor Green
Write-Host "  host: $dbHost`n  port: $dbPort`n  database: $dbName`n  app user: $appUser"

# Create DB and user
$sql = @"
CREATE DATABASE IF NOT EXISTS `$dbName`;
CREATE USER IF NOT EXISTS '$appUser'@'%' IDENTIFIED BY '$appPass';
GRANT ALL PRIVILEGES ON `$dbName`.* TO '$appUser'@'%';
FLUSH PRIVILEGES;
"@

Write-Host "Creating database and user (you may be prompted by mysql)..." -ForegroundColor Cyan
$mysqlCmd = "mysql -h $dbHost -P $dbPort -u $adminUser -p$adminPwd -e `"$sql`""
# Execute
try {
    iex $mysqlCmd
    Write-Host "Database and user created or already exist." -ForegroundColor Green
} catch {
    Write-Error "Failed to run SQL commands. Check admin credentials and connectivity. Error: $_"
    exit 1
}

# Run backend setup: npm install, prisma generate, migrate, seed
Push-Location -Path "backend"
try {
    Write-Host "Installing backend dependencies (npm install)..." -ForegroundColor Cyan
    npm install

    Write-Host "Generating Prisma client..." -ForegroundColor Cyan
    npm run prisma:generate

    Write-Host "Applying Prisma migrations (this will create a migration folder)..." -ForegroundColor Cyan
    npx prisma migrate dev --name init --skip-seed

    Write-Host "Running seed script..." -ForegroundColor Cyan
    npm run prisma:seed

    Write-Host "Database setup complete!" -ForegroundColor Green
} catch {
    Write-Error "An error occurred during backend setup: $_"
    exit 1
} finally {
    Pop-Location
}
