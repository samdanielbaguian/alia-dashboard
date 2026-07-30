#!/bin/bash

# Alia Marketplace - Test Runner Script
# Usage: ./run-tests.sh [unit|integration|all|coverage]

set -e

echo "╔════════════════════════════════════════════════════╗"
echo "║   Alia Marketplace - E2E Cart Test Runner          ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Parse arguments
TEST_TYPE="${1:-unit}"

case $TEST_TYPE in
    unit)
        echo -e "${BLUE}Running Unit Tests (17 tests)${NC}"
        echo "Tests cover all cart operations with mocked API"
        echo ""
        npm test -- tests/cart-flow.test.js
        ;;
    integration)
        echo -e "${BLUE}Running Integration Tests${NC}"
        echo -e "${YELLOW}Note: Requires backend running at http://localhost:8000${NC}"
        echo ""
        if ! curl -s http://localhost:8000/health > /dev/null; then
            echo -e "${RED}✗ Backend not accessible at http://localhost:8000${NC}"
            echo "Start backend first:"
            echo "  cd backend"
            echo "  python -m uvicorn app.main:app --reload"
            exit 1
        fi
        echo -e "${GREEN}✓ Backend is running${NC}"
        echo ""
        RUN_INTEGRATION_TESTS=true npm test -- tests/cart-api.integration.js
        ;;
    all)
        echo -e "${BLUE}Running All Tests (Unit + Integration)${NC}"
        echo ""
        echo "Step 1: Unit Tests..."
        npm test -- tests/cart-flow.test.js
        echo ""
        echo "Step 2: Integration Tests..."
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            RUN_INTEGRATION_TESTS=true npm test -- tests/cart-api.integration.js
        else
            echo -e "${YELLOW}⚠ Backend not running, skipping integration tests${NC}"
        fi
        ;;
    coverage)
        echo -e "${BLUE}Running Tests with Coverage Report${NC}"
        echo ""
        npm test -- --coverage tests/cart-flow.test.js
        echo ""
        echo -e "${GREEN}✓ Coverage report generated in coverage/index.html${NC}"
        ;;
    watch)
        echo -e "${BLUE}Running Tests in Watch Mode${NC}"
        echo "Re-runs tests when files change"
        echo ""
        npm test -- --watch tests/cart-flow.test.js
        ;;
    debug)
        echo -e "${BLUE}Running Tests in Debug Mode${NC}"
        echo "Verbose output for troubleshooting"
        echo ""
        npm test -- --verbose --detectOpenHandles tests/cart-flow.test.js
        ;;
    single)
        if [ -z "$2" ]; then
            echo "Usage: $0 single <test-name-pattern>"
            echo ""
            echo "Examples:"
            echo "  $0 single 'should add a single product'"
            echo "  $0 single 'should create order'"
            echo "  $0 single 'payment method'"
            exit 1
        fi
        echo -e "${BLUE}Running Single Test: $2${NC}"
        npm test -- --testNamePattern="$2" tests/cart-flow.test.js
        ;;
    *)
        echo "Usage: $0 [unit|integration|all|coverage|watch|debug|single]"
        echo ""
        echo "Commands:"
        echo "  unit         Run unit tests (17 tests, ~2s)"
        echo "  integration  Run integration tests (requires backend)"
        echo "  all          Run all tests"
        echo "  coverage     Run tests with coverage report"
        echo "  watch        Run tests in watch mode (auto-rerun on changes)"
        echo "  debug        Run tests with verbose output"
        echo "  single       Run a single test by name pattern"
        echo ""
        echo "Examples:"
        echo "  $0                    # Run unit tests"
        echo "  $0 all                # Run all tests"
        echo "  $0 coverage           # Generate coverage report"
        echo "  $0 single 'should add' # Run test matching 'should add'"
        exit 1
        ;;
esac

# Show summary
echo ""
echo -e "${GREEN}✓ Test run completed${NC}"
echo ""
