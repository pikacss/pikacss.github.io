#!/usr/bin/env bash
# verify-api-docs.sh - Verifies API documentation accuracy against TypeScript source code
# Checks that all documented API signatures match actual exports

set -e
set -u

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== API Documentation Verification ==="
echo

# Pre-flight checks
echo "Checking prerequisites..."

# 1. Verify @pikacss/api-verifier is built
if [[ ! -f "packages/api-verifier/dist/index.mjs" ]]; then
  echo -e "${RED}✗ @pikacss/api-verifier not built${NC}"
  echo
  echo "Please build the package first:"
  echo "  pnpm --filter @pikacss/api-verifier build"
  echo
  echo "Or build all packages:"
  echo "  pnpm build"
  exit 1
fi

# 2. Verify all packages are built (check for dist/ directories)
echo "Checking package builds..."
MISSING_BUILDS=0

for pkg in packages/*/; do
  pkg_name=$(basename "$pkg")
  
  # Skip api-verifier itself and non-package directories
  if [[ "$pkg_name" == "api-verifier" ]] || [[ ! -f "$pkg/package.json" ]]; then
    continue
  fi
  
  # Check if dist/ exists
  if [[ ! -d "$pkg/dist" ]]; then
    echo -e "${YELLOW}  Warning: $pkg_name not built (missing dist/)${NC}"
    MISSING_BUILDS=$((MISSING_BUILDS + 1))
  fi
done

if [[ $MISSING_BUILDS -gt 0 ]]; then
  echo -e "${YELLOW}⚠ $MISSING_BUILDS package(s) not built${NC}"
  echo
  echo "To build all packages:"
  echo "  pnpm build"
  echo
  echo "Continuing anyway (may affect verification results)..."
  echo
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"
echo

# Execute verification
echo "Running API verification..."
echo

# Run the api-verifier CLI
node packages/api-verifier/dist/index.mjs

# Capture exit code
EXIT_CODE=$?

echo
echo "=== Verification Complete ==="
echo

# Display generated reports if they exist
if [[ -f "api-verification-report.md" ]]; then
  echo "Markdown report generated: api-verification-report.md"
  echo
  echo "--- Report Preview (first 30 lines) ---"
  head -n 30 api-verification-report.md
  echo "--- End Preview ---"
  echo
fi

if [[ -f "api-verification-report.json" ]]; then
  echo "JSON report generated: api-verification-report.json"
fi

echo

# Exit with captured exit code
if [[ $EXIT_CODE -eq 0 ]]; then
  echo -e "${GREEN}✓ All API documentation is accurate${NC}"
else
  echo -e "${RED}✗ API documentation mismatches found${NC}"
  echo
  echo "Review the generated reports for details."
fi

exit $EXIT_CODE
