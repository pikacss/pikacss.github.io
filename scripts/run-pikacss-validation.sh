#!/usr/bin/env bash
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== PikaCSS Documentation Validation ===${NC}\n"

FAILED=0

# Step 1: ESLint with PikaCSS rules and custom formatter
echo -e "${YELLOW}[1/2] Running ESLint with PikaCSS custom rules...${NC}"
if pnpm eslint --format ./.eslint/formatters/pikacss-detailed.ts \
    "docs/**/*.md" \
    "packages/*/README.md" \
    "AGENTS.md" \
    ".github/skills/**/*.md"; then
  echo -e "${GREEN}✓ ESLint validation passed${NC}\n"
else
  echo -e "${RED}✗ ESLint validation failed${NC}\n"
  FAILED=$((FAILED + 1))
fi

# Step 2: Multi-bundler integration tests
echo -e "${YELLOW}[2/2] Running multi-bundler integration tests...${NC}"
if pnpm test:eslint; then
  echo -e "${GREEN}✓ Integration tests passed${NC}\n"
else
  echo -e "${RED}✗ Integration tests failed${NC}\n"
  FAILED=$((FAILED + 1))
fi

# Summary
echo -e "${GREEN}=== Validation Summary ===${NC}"
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All PikaCSS validations passed ✓${NC}"
  exit 0
else
  echo -e "${RED}$FAILED validation step(s) failed ✗${NC}"
  exit 1
fi
