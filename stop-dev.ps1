$ErrorActionPreference = "Stop"

function Write-Step($msg) {
  Write-Host "[wellnest] $msg" -ForegroundColor Yellow
}

function Stop-IfRunning($processId, $name) {
  if (-not $processId) { return }
  $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
  if ($null -eq $proc) {
    Write-Step "$name process ($processId) already stopped."
    return
  }
  Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
  Write-Step "$name process ($processId) stopped."
}

function Stop-IfListeningOnPort($port, $label) {
  $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if (-not $listeners) { return }
  $pids = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pidToStop in $pids) {
    if (-not $pidToStop -or $pidToStop -eq 0) { continue }
    Stop-IfRunning $pidToStop "$label port process"
  }
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $root ".dev-processes.json"

if (-not (Test-Path $pidFile)) {
  Write-Step "No .dev-processes.json found. Trying port-based cleanup (8080, 5173)."
  Stop-IfListeningOnPort 8080 "Backend"
  Stop-IfListeningOnPort 5173 "Frontend"
  Write-Step "Done."
  exit 0
}

$record = Get-Content $pidFile -Raw | ConvertFrom-Json

Stop-IfRunning $record.backendPid "Backend terminal"
Stop-IfRunning $record.frontendPid "Frontend terminal"

Remove-Item $pidFile -Force -ErrorAction SilentlyContinue

# Extra cleanup in case processes were started outside start-dev.
Stop-IfListeningOnPort 8080 "Backend"
Stop-IfListeningOnPort 5173 "Frontend"

Write-Step "Done."
