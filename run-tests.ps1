# Alia Marketplace - Test Runner Script (Windows)
# Usage: .\run-tests.ps1 -Type unit|integration|all|coverage
# Or: .\run-tests.ps1 unit

param(
    [Parameter(Position=0)]
    [ValidateSet('unit', 'integration', 'all', 'coverage', 'watch', 'debug', 'single')]
    [string]$Type = 'unit',
    
    [string]$Pattern = ''
)

# Colors for output
$Green = @{ ForegroundColor = "Green" }
$Blue = @{ ForegroundColor = "Cyan" }
$Yellow = @{ ForegroundColor = "Yellow" }
$Red = @{ ForegroundColor = "Red" }

Write-Host "╔════════════════════════════════════════════════════╗" @Blue
Write-Host "║   Alia Marketplace - E2E Cart Test Runner          ║" @Blue
Write-Host "╚════════════════════════════════════════════════════╝" @Blue
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✗ Node.js not found. Please install Node.js first." @Red
    exit 1
}

# Check if npm dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." @Yellow
    npm install
}

# Run tests based on type
switch ($Type) {
    'unit' {
        Write-Host "Running Unit Tests (17 tests)" @Blue
        Write-Host "Tests cover all cart operations with mocked API" @Blue
        Write-Host ""
        npm test -- tests/cart-flow.test.js
    }
    
    'integration' {
        Write-Host "Running Integration Tests" @Blue
        Write-Host "Note: Requires backend running at http://localhost:8000" @Yellow
        Write-Host ""
        
        # Check if backend is running
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            Write-Host "✓ Backend is running" @Green
        }
        catch {
            Write-Host "✗ Backend not accessible at http://localhost:8000" @Red
            Write-Host "Start backend first:" @Red
            Write-Host "  cd backend" @Red
            Write-Host "  python -m uvicorn app.main:app --reload" @Red
            exit 1
        }
        
        Write-Host ""
        $env:RUN_INTEGRATION_TESTS = 'true'
        npm test -- tests/cart-api.integration.js
    }
    
    'all' {
        Write-Host "Running All Tests (Unit + Integration)" @Blue
        Write-Host ""
        
        Write-Host "Step 1: Unit Tests..." @Blue
        npm test -- tests/cart-flow.test.js
        Write-Host ""
        
        Write-Host "Step 2: Integration Tests..." @Blue
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            Write-Host "✓ Backend is running" @Green
            Write-Host ""
            $env:RUN_INTEGRATION_TESTS = 'true'
            npm test -- tests/cart-api.integration.js
        }
        catch {
            Write-Host "⚠ Backend not running, skipping integration tests" @Yellow
        }
    }
    
    'coverage' {
        Write-Host "Running Tests with Coverage Report" @Blue
        Write-Host ""
        npm test -- --coverage tests/cart-flow.test.js
        Write-Host ""
        Write-Host "✓ Coverage report generated in coverage/index.html" @Green
    }
    
    'watch' {
        Write-Host "Running Tests in Watch Mode" @Blue
        Write-Host "Re-runs tests when files change" @Blue
        Write-Host ""
        npm test -- --watch tests/cart-flow.test.js
    }
    
    'debug' {
        Write-Host "Running Tests in Debug Mode" @Blue
        Write-Host "Verbose output for troubleshooting" @Blue
        Write-Host ""
        npm test -- --verbose --detectOpenHandles tests/cart-flow.test.js
    }
    
    'single' {
        if ([string]::IsNullOrEmpty($Pattern)) {
            Write-Host "Usage: .\run-tests.ps1 single -Pattern 'test-name-pattern'" @Yellow
            Write-Host ""
            Write-Host "Examples:" @Yellow
            Write-Host "  .\run-tests.ps1 single -Pattern 'should add a single product'" @Blue
            Write-Host "  .\run-tests.ps1 single -Pattern 'should create order'" @Blue
            Write-Host "  .\run-tests.ps1 single -Pattern 'payment method'" @Blue
            exit 1
        }
        Write-Host "Running Single Test: $Pattern" @Blue
        npm test -- --testNamePattern=$Pattern tests/cart-flow.test.js
    }
}

# Show summary
Write-Host ""
Write-Host "✓ Test run completed" @Green
Write-Host ""
