#!/usr/bin/env bash
# check-placeholders.sh - Detects placeholder content in markdown files
# Searches for TODO, TBD, FIXME, PLACEHOLDER markers and similar patterns

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track findings
FINDINGS=0

echo "Checking for placeholder content in markdown..."
echo

# Placeholder patterns to search for (case-insensitive)
PATTERNS=(
  "TODO"
  "FIXME"
  "TBD"
  "PLACEHOLDER"
  "\\[placeholder"
  "to be written"
  "coming soon"
  "work in progress"
  "WIP"
)

# Create grep pattern (OR all patterns)
GREP_PATTERN=$(IFS='|'; echo "${PATTERNS[*]}")

# Create temporary file for results
TEMP_RESULTS=$(mktemp)
trap "rm -f $TEMP_RESULTS" EXIT

# Find all markdown files and search for placeholders
find . -name "*.md" -not -path "./.planning/*" -not -path "./node_modules/*" -type f -exec grep -niHE "$GREP_PATTERN" {} \; 2>/dev/null > "$TEMP_RESULTS" || true

# Process results
while IFS=: read -r file line_num line_content; do
  # Skip empty lines
  [ -z "$file" ] && continue
  
  # Trim whitespace from line content
  line_content=$(echo "$line_content" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  
  # Limit line content to 100 characters for display
  if [ ${#line_content} -gt 100 ]; then
    line_content="${line_content:0:97}..."
  fi
  
  echo -e "${YELLOW}${file}:${line_num}: ${line_content}${NC}"
  ((FINDINGS++))
done < "$TEMP_RESULTS"

echo
if [[ $FINDINGS -eq 0 ]]; then
  echo -e "${GREEN}✓ No placeholder content found${NC}"
  exit 0
else
  echo -e "${RED}✗ Found $FINDINGS placeholder marker(s)${NC}"
  exit 1
fi
