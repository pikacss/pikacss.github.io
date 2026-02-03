#!/usr/bin/env bash

# run-all-checks.sh
# Unified validation script orchestrating all documentation quality checks
# Exit code: 0 if all checks pass, 1 if any check fails

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track results
TOTAL_CHECKS=4
PASSED_CHECKS=0
FAILED_CHECKS=0
declare -a FAILURES

echo -e "${BLUE}=== Documentation Validation ===${NC}\n"

# Helper function to run a check
run_check() {
  local check_num=$1
  local check_name=$2
  local check_command=$3
  
  echo -e "${BLUE}[$check_num/$TOTAL_CHECKS]${NC} ${check_name}..."
  
  # Create temp file for output
  local output_file
  output_file=$(mktemp)
  trap "rm -f $output_file" EXIT
  
  # Run the check and capture output
  if eval "$check_command" > "$output_file" 2>&1; then
    echo -e "${GREEN}✓ Passed${NC}\n"
    ((PASSED_CHECKS++))
    return 0
  else
    local exit_code=$?
    echo -e "${RED}✗ Failed${NC}"
    
    # Show relevant output (first 10 lines of errors)
    if [[ -s "$output_file" ]]; then
      head -n 10 "$output_file" | sed 's/^/  /'
      local line_count
      line_count=$(wc -l < "$output_file")
      if [[ $line_count -gt 10 ]]; then
        echo -e "  ${YELLOW}... and $((line_count - 10)) more lines${NC}"
      fi
    fi
    echo ""
    
    ((FAILED_CHECKS++))
    FAILURES+=("$check_name")
    return $exit_code
  fi
}

# Check 1: ESLint markdown validation
run_check 1 "ESLint markdown validation" "pnpm lint --quiet" || true

# Check 2: Internal link validation
run_check 2 "Internal link validation" "bash scripts/check-links.sh" || true

# Check 3: File reference validation
run_check 3 "File reference validation" "bash scripts/check-file-refs.sh" || true

# Check 4: Placeholder detection
run_check 4 "Placeholder detection" "bash scripts/check-placeholders.sh" || true

# Print summary
echo -e "${BLUE}=== Summary ===${NC}"
echo -e "${GREEN}✓ ${PASSED_CHECKS} passed${NC}"

if [[ $FAILED_CHECKS -gt 0 ]]; then
  echo -e "${RED}✗ ${FAILED_CHECKS} failed${NC}"
  echo ""
  echo -e "${RED}Failed checks:${NC}"
  for failure in "${FAILURES[@]}"; do
    echo -e "  - $failure"
  done
  echo ""
  exit 1
else
  echo -e "\n${GREEN}All validation checks passed!${NC}"
  exit 0
fi
