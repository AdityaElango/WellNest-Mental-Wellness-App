Param(
  [string]$EnvFile = ".env.local",
  [switch]$ForceKillPorts
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) {
  Write-Host "[wellnest] $msg" -ForegroundColor Cyan
}

function Require-Path($path, $what) {
  if (-not (Test-Path $path)) {
    throw "$what not found: $path"
  }
}

function Import-EnvFile($path) {
  if (-not (Test-Path $path)) {
    throw "Missing env file: $path (copy .env.local.example -> .env.local first)"
  }

  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    $pair = $line -split "=", 2
    if ($pair.Count -ne 2) { return }
    $name = $pair[0].Trim()
    $value = $pair[1].Trim()
    [Environment]::SetEnvironmentVariable($name, $value, "Process")
  }
}

function Stop-PortProcessIfAny($port, $label, $forceKill) {
  $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if (-not $listeners) { return }

  $pids = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pidToStop in $pids) {
    if (-not $pidToStop -or $pidToStop -eq 0) { continue }
    $proc = Get-Process -Id $pidToStop -ErrorAction SilentlyContinue
    if ($null -eq $proc) { continue }
    if (-not $forceKill) {
      Write-Host "[wellnest] $label port $port is in use by PID $pidToStop ($($proc.ProcessName))." -ForegroundColor Yellow
      $choice = Read-Host "Kill this process and continue? (y/N)"
      if ($choice -notin @("y", "Y", "yes", "YES")) {
        throw "$label startup cancelled. Port $port is occupied by PID $pidToStop."
      }
    }
    Write-Step "Stopping PID $pidToStop ($($proc.ProcessName)) on port $port..."
    Stop-Process -Id $pidToStop -Force -ErrorAction SilentlyContinue
  }
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverDir = Join-Path $root "server"
$clientDir = Join-Path $root "client"
$mavenCmd = Join-Path $root ".tools\apache-maven-3.9.14\bin\mvn.cmd"
$pidFile = Join-Path $root ".dev-processes.json"

Require-Path $serverDir "Server directory"
Require-Path $clientDir "Client directory"
Require-Path $mavenCmd "Portable Maven"

Set-Location $root
Import-EnvFile (Join-Path $root $EnvFile)

if (-not $env:MONGO_URI) { throw "MONGO_URI is required in $EnvFile" }
if (-not $env:JWT_SECRET) { throw "JWT_SECRET is required in $EnvFile" }
if (-not $env:PORT) { $env:PORT = "8080" }
if (-not $env:CORS_ALLOWED_ORIGIN_PATTERNS) {
  $env:CORS_ALLOWED_ORIGIN_PATTERNS = "http://localhost:5173,http://127.0.0.1:5173,http://192.168.*:5173,http://10.*:5173,http://172.16.*:5173"
}
if (-not $env:VITE_API_URL) { $env:VITE_API_URL = "http://localhost:$($env:PORT)" }
if ($env:MONGO_URI -like "*<username>*" -or $env:MONGO_URI -like "*<database>*") {
  throw "MONGO_URI in $EnvFile still has template placeholders. Set a real Atlas URI including database name."
}
if ($env:MONGO_URI -notmatch "mongodb(\+srv)?:\/\/.+\/[^\/\?]+(\?.*)?$") {
  throw "MONGO_URI must include a database name in the path, e.g. ...mongodb.net/wellnest?appName=..."
}

# Avoid common startup failure: stale local servers already running on required ports.
Stop-PortProcessIfAny -port ([int]$env:PORT) -label "Backend" -forceKill:$ForceKillPorts
Stop-PortProcessIfAny -port 5173 -label "Frontend" -forceKill:$ForceKillPorts

Write-Step "Starting backend on port $($env:PORT)..."
$backendProcess = Start-Process powershell -PassThru -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$serverDir'; `$env:MONGO_URI='$($env:MONGO_URI)'; `$env:JWT_SECRET='$($env:JWT_SECRET)'; `$env:PORT='$($env:PORT)'; `$env:CORS_ALLOWED_ORIGIN_PATTERNS='$($env:CORS_ALLOWED_ORIGIN_PATTERNS)'; & '$mavenCmd' spring-boot:run"
)

Write-Step "Starting frontend on http://localhost:5173 ..."
$frontendProcess = Start-Process powershell -PassThru -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$clientDir'; `$env:VITE_API_URL='$($env:VITE_API_URL)'; npm run dev -- --host 0.0.0.0 --port 5173"
)

$record = [ordered]@{
  startedAt = (Get-Date).ToString("o")
  backendPid = $backendProcess.Id
  frontendPid = $frontendProcess.Id
}
$record | ConvertTo-Json | Set-Content -Path $pidFile -Encoding UTF8

Write-Step "Done. Two new PowerShell windows were opened for backend and frontend."
Write-Step "Process record saved to .dev-processes.json"
