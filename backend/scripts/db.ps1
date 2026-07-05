param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("migrate", "seed", "test", "test-postgres")]
    [string] $Command
)

$ErrorActionPreference = "Stop"
$backendRoot = Split-Path -Parent $PSScriptRoot
Set-Location $backendRoot

switch ($Command) {
    "migrate" {
        python -m alembic upgrade head
    }
    "seed" {
        python -m app.db.init_db
    }
    "test" {
        python -m pytest
    }
    "test-postgres" {
        python -m pytest -m postgres
    }
}
