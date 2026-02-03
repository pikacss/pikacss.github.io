#!/usr/bin/env bash
# check-file-refs.sh - Validates file:line code references in markdown files
# Checks that referenced files exist and line numbers don't exceed file length

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

# Count lines in a file
count_lines() {
  local file="$1"
  wc -l < "$file" | tr -d ' '
}

# Resolve file path (handle @ alias and relative paths)
resolve_file_path() {
  local ref_file="$1"
  local source_dir="$2"
  
  # Handle @ alias (resolves to docs/ or project root)
  if [[ "$ref_file" == @/* ]]; then
    # Try docs/ first (VitePress convention)
    if [[ -f "docs/${ref_file#@/}" ]]; then
      echo "docs/${ref_file#@/}"
      return 0
    fi
    # Try project root
    if [[ -f "${ref_file#@/}" ]]; then
      echo "${ref_file#@/}"
      return 0
    fi
    # Not found
    return 1
  fi
  
  # Absolute path from repo root
  if [[ "$ref_file" == /* ]]; then
    echo "${ref_file#/}"
    return 0
  fi
  
  # Relative path from source file
  echo "$source_dir/$ref_file"
}

echo "Checking file:line references in markdown..."
echo

# Create temporary file for results
TEMP_MATCHES=$(mktemp)
trap "rm -f $TEMP_MATCHES" EXIT

# Find all file:line patterns in all markdown files
find . -name "*.md" -not -path "./.planning/*" -not -path "./node_modules/*" -type f -exec grep -nHEo '[a-zA-Z0-9_./][-a-zA-Z0-9_./]*\.(ts|js|tsx|jsx|vue|css|json|md):[0-9]+' {} \; 2>/dev/null > "$TEMP_MATCHES" || true

# Process matches
while IFS=: read -r markdown_file line_num matched_ref rest; do
  # Skip empty lines
  [ -z "$markdown_file" ] && continue
  [ -z "$matched_ref" ] && continue
  
  # Handle case where matched_ref might be split
  if [ -n "$rest" ]; then
    matched_ref="${matched_ref}:${rest}"
  fi
  
  source_dir=$(dirname "$markdown_file")
  
  # Extract file and line number from reference
  ref_file="${matched_ref%:*}"
  ref_line="${matched_ref##*:}"
  
  # Resolve file path
  resolved_file=$(resolve_file_path "$ref_file" "$source_dir" 2>/dev/null) || {
    echo -e "${RED}${markdown_file}:${line_num}: Invalid reference '${matched_ref}' (file not found)${NC}"
    ((FAILURES++))
    continue
  }
  
  # Check if file exists
  if [[ ! -f "$resolved_file" ]]; then
    echo -e "${RED}${markdown_file}:${line_num}: Invalid reference '${matched_ref}' (file not found: ${resolved_file})${NC}"
    ((FAILURES++))
    continue
  fi
  
  # Check if line number is within file length
  file_lines=$(count_lines "$resolved_file")
  if [[ $ref_line -gt $file_lines ]]; then
    echo -e "${RED}${markdown_file}:${line_num}: Invalid reference '${matched_ref}' (line ${ref_line} exceeds file length ${file_lines})${NC}"
    ((FAILURES++))
  fi
done < "$TEMP_MATCHES"

echo
if [[ $FAILURES -eq 0 ]]; then
  echo -e "${GREEN}✓ All file:line references are valid${NC}"
  exit 0
else
  echo -e "${RED}✗ Found $FAILURES invalid reference(s)${NC}"
  exit 1
fi
