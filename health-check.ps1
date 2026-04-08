Param(
  [string]$FrontendUrl = "http://localhost:5173",
  [string]$BackendUrl = "http://localhost:8080/api/auth/login",
  [int]$TimeoutSec = 5
)

$ErrorActionPreference = "Stop"

function Check-Url($name, $url, $method = "GET", $body = $null, $contentType = "application/json") {
  try {
    if ($method -eq "POST") {
      $response = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType $contentType -UseBasicParsing -TimeoutSec $TimeoutSec
    } else {
      $response = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing -TimeoutSec $TimeoutSec
    }
    return @{ ok = $true; status = [int]$response.StatusCode; message = "$name is UP ($($response.StatusCode))" }
  } catch {
    $status = $null
    if ($_.Exception.Response) {
      try { $status = [int]$_.Exception.Response.StatusCode.value__ } catch {}
    }

    # Treat 401/403 as healthy for protected backend endpoints.
    if ($status -eq 401 -or $status -eq 403) {
      return @{ ok = $true; status = $status; message = "$name is UP ($status - auth protected)" }
    }

    $msg = if ($status) { "$name is DOWN ($status)" } else { "$name is DOWN (no response)" }
    return @{ ok = $false; status = $status; message = $msg }
  }
}

Write-Host "[wellnest] Running health check..." -ForegroundColor Cyan

$frontend = Check-Url -name "Frontend" -url $FrontendUrl
$backend = Check-Url -name "Backend" -url $BackendUrl -method "POST" -body '{"email":"health@example.com","password":"healthcheck"}'

if ($frontend.ok) {
  Write-Host "✅ $($frontend.message)" -ForegroundColor Green
} else {
  Write-Host "❌ $($frontend.message)" -ForegroundColor Red
}

if ($backend.ok) {
  Write-Host "✅ $($backend.message)" -ForegroundColor Green
} else {
  Write-Host "❌ $($backend.message)" -ForegroundColor Red
}

if ($frontend.ok -and $backend.ok) {
  Write-Host "[wellnest] Overall: HEALTHY" -ForegroundColor Green
  exit 0
} else {
  Write-Host "[wellnest] Overall: UNHEALTHY" -ForegroundColor Red
  exit 1
}
