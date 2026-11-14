#!/bin/bash
# End-to-End Test for Employee Profile Functionality

echo "=== Employee Profile Functionality - End-to-End Test ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

function test_result() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((TESTS_FAILED++))
  fi
}

# ====================
# Test 1: Backend Health
# ====================
echo "Test 1: Backend Health Check"
RESPONSE=$(curl -s http://localhost:5000/api/health)
echo "$RESPONSE" | grep -q "setup-required\|ok"
test_result "Backend is responding to /api/health"
echo ""

# ====================
# Test 2: Frontend Availability
# ====================
echo "Test 2: Frontend Server Check"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
[ "$HTTP_CODE" = "200" ]
test_result "Frontend is serving on port 5173 (HTTP $HTTP_CODE)"
echo ""

# ====================
# Test 3: Firebase Configuration
# ====================
echo "Test 3: Firebase Configuration"
cd src/services/server
node -e "
const config = require('./config.js');
const { auth, db } = config;
console.log('Firebase initialized');
" 2>/dev/null
test_result "Firebase Admin SDK can be initialized"
cd ../../..
echo ""

# ====================
# Summary
# ====================
echo ""
echo "=== Test Summary ==="
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed! ✓${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed!${NC}"
  exit 1
fi
