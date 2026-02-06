#!/usr/bin/env bash
# check-links.sh - Validates internal markdown links only (no external URLs)
# Checks both file links (./file.md) and anchor links (#heading, ./file.md#anchor)

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0
FAILURES_FILE=$(mktemp)
echo "0" > "$FAILURES_FILE"
trap "rm -f $FAILURES_FILE" EXIT

# Convert markdown heading to anchor format (lowercase, spaces to dashes, remove special chars)
heading_to_anchor() {
  local heading="$1"
  echo "$heading" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 -]//g' | sed 's/ /-/g'
}

# Extract headings from markdown file
extract_headings() {
  local file="$1"
  grep -E '^#{1,6} ' "$file" | sed 's/^#* //'
}

# Check if anchor exists in target file
check_anchor() {
  local target_file="$1"
  local anchor="$2"
  
  if [[ ! -f "$target_file" ]]; then
    return 1
  fi
  
  # Extract headings and convert to anchors
  while IFS= read -r heading; do
    local heading_anchor
    heading_anchor=$(heading_to_anchor "$heading")
    if [[ "$heading_anchor" == "$anchor" ]]; then
      return 0
    fi
  done < <(extract_headings "$target_file")
  
  return 1
}

# Resolve relative path from source file
resolve_path() {
  local source_file="$1"
  local link_path="$2"
  local source_dir
  
  source_dir=$(dirname "$source_file")
  
  # Resolve relative path
  if [[ "$link_path" == /* ]]; then
    # Absolute path from VitePress root (docs/)
    local vitepress_path="${link_path#/}"
    
    # Check if it's a static asset in public/ directory
    if [[ "$vitepress_path" == images/* ]] || [[ "$vitepress_path" == assets/* ]] || [[ "$vitepress_path" == *.png ]] || [[ "$vitepress_path" == *.jpg ]] || [[ "$vitepress_path" == *.svg ]]; then
      echo "docs/public/$vitepress_path"
    else
      # It's a documentation link - add docs/ prefix and .md suffix if not already present
      if [[ "$vitepress_path" != *.md ]]; then
        echo "docs/$vitepress_path.md"
      else
        echo "docs/$vitepress_path"
      fi
    fi
  else
    # Relative path
    echo "$source_dir/$link_path"
  fi
}

echo "Checking internal markdown links..."
echo

# Find all markdown files, excluding .planning/**, node_modules/**, build output, and skill documentation examples
while IFS= read -r file; do
  # Skip skills/README.md (contains intentional broken link examples in "Common Validation Errors" section)
  if [[ "$file" == "./skills/README.md" ]]; then
    continue
  fi
  
  # Skip legacy path (kept for backward compatibility)
  if [[ "$file" == "./.github/skills/README.md" ]]; then
    continue
  fi
  
  # Extract markdown links: [text](path) or [text](path#anchor)
  # Match pattern: [anything](not-starting-with-http...)
  grep -n '\[.*\]([^)]*)' "$file" 2>/dev/null | while IFS=: read -r line_num line_content; do
    # Skip code blocks (lines starting with tabs or 4+ spaces, or containing backticks around the match)
    if [[ "$line_content" =~ ^[[:space:]]{4,} ]] || [[ "$line_content" =~ ^\t ]]; then
      continue
    fi
    
    # Skip documentation example lines (lines showing how to write links)
    if [[ "$line_content" =~ (Use relative paths|Example:|For example:|e\.g\.|should be|must be) ]]; then
      continue
    fi
    
    # Extract link targets (excluding http:// and https://)
    echo "$line_content" | grep -o '\[[^]]*\]([^)]*)' | while read -r link; do
      # Extract path from [text](path)
      target=$(echo "$link" | sed 's/\[.*\](\(.*\))/\1/')
      
      # Skip external links
      if [[ "$target" =~ ^https?:// ]]; then
        continue
      fi
      
      # Skip mailto links
      if [[ "$target" =~ ^mailto: ]]; then
        continue
      fi
      
      # Skip empty links or root-only links
      if [[ -z "$target" ]] || [[ "$target" == "/" ]]; then
        continue
      fi
      
      # Split path and anchor
      if [[ "$target" == *"#"* ]]; then
        link_path="${target%%#*}"
        anchor="${target#*#}"
      else
        link_path="$target"
        anchor=""
      fi
      
      # Handle anchor-only links (e.g., #heading)
      if [[ -z "$link_path" ]]; then
        # Check anchor in current file
        if [[ -n "$anchor" ]]; then
          if ! check_anchor "$file" "$anchor"; then
            echo -e "${RED}${file}:${line_num}: Broken anchor link to '#${anchor}'${NC}"
            echo $(($(cat "$FAILURES_FILE") + 1)) > "$FAILURES_FILE"
          fi
        fi
        continue
      fi
      
      # Resolve relative path
      resolved_path=$(resolve_path "$file" "$link_path")
      
      # If path is a directory, try README.md
      if [[ -d "$resolved_path" ]]; then
        resolved_path="$resolved_path/README.md"
      fi
      
      # Check if target file exists
      if [[ ! -f "$resolved_path" ]]; then
        echo -e "${RED}${file}:${line_num}: Broken link to '${target}' (resolved: ${resolved_path})${NC}"
        echo $(($(cat "$FAILURES_FILE") + 1)) > "$FAILURES_FILE"
        continue
      fi
      
      # Strict case-sensitive check for case-insensitive file systems (macOS)
      # This ensures links work on Linux (GitHub Actions) even when developed on macOS
      resolved_dir=$(dirname "$resolved_path")
      resolved_file=$(basename "$resolved_path")
      if [[ -d "$resolved_dir" ]]; then
        actual_file=$(ls -1 "$resolved_dir" 2>/dev/null | grep -x "$resolved_file" || echo "")
        if [[ -z "$actual_file" ]]; then
          # File exists but with different case
          actual_case=$(ls -1 "$resolved_dir" 2>/dev/null | grep -ix "$resolved_file" || echo "")
          if [[ -n "$actual_case" ]]; then
            echo -e "${RED}${file}:${line_num}: Case mismatch in link to '${target}' (expected: ${resolved_file}, actual: ${actual_case})${NC}"
            echo $(($(cat "$FAILURES_FILE") + 1)) > "$FAILURES_FILE"
            continue
          fi
        fi
      fi
      
      # If anchor specified, check if it exists in target file
      if [[ -n "$anchor" ]]; then
        if ! check_anchor "$resolved_path" "$anchor"; then
          echo -e "${RED}${file}:${line_num}: Broken anchor link to '${target}' (anchor '#${anchor}' not found)${NC}"
          echo $(($(cat "$FAILURES_FILE") + 1)) > "$FAILURES_FILE"
        fi
      fi
    done
  done
done < <(find . -name "*.md" -not -path "./.planning/*" -not -path "./node_modules/*" -not -path "./docs/.vitepress/dist/*" -type f) || true

FAILURES=$(cat "$FAILURES_FILE")
echo
if [[ $FAILURES -eq 0 ]]; then
  echo -e "${GREEN}✓ All internal links are valid${NC}"
  exit 0
else
  echo -e "${RED}✗ Found $FAILURES broken link(s)${NC}"
  exit 1
fi
