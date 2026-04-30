#!/usr/bin/env bash
# pre-migration-audit.sh
# Run BEFORE any Supabase migration to check for column dependencies.
# Usage: ./scripts/pre-migration-audit.sh <migration-file.sql>

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ $# -lt 1 ]; then
  echo -e "${RED}Usage: $0 <migration-file.sql>${NC}"
  exit 1
fi

MIGRATION_FILE="$1"

if [ ! -f "$MIGRATION_FILE" ]; then
  echo -e "${RED}File not found: $MIGRATION_FILE${NC}"
  exit 1
fi

echo -e "${YELLOW}=== Pre-migration audit ===${NC}"
echo "File: $MIGRATION_FILE"
echo ""

ERRORS=0

# 1. Check for DROP COLUMN statements
DROPS=$(grep -iE 'DROP\s+COLUMN' "$MIGRATION_FILE" || true)
if [ -n "$DROPS" ]; then
  echo -e "${RED}[DANGER] DROP COLUMN detected:${NC}"
  echo "$DROPS"
  echo ""

  # Extract column names and check if they're referenced in edge functions
  COLUMNS=$(echo "$DROPS" | grep -oiE 'DROP\s+COLUMN\s+(IF\s+EXISTS\s+)?([a-z_]+)' | awk '{print $NF}')
  for col in $COLUMNS; do
    echo -e "  Checking references to column '${YELLOW}$col${NC}'..."
    REFS=$(grep -rn "$col" supabase/functions/ 2>/dev/null || true)
    if [ -n "$REFS" ]; then
      echo -e "  ${RED}[BLOCKED] Column '$col' is referenced in edge functions:${NC}"
      echo "$REFS" | head -10
      ERRORS=$((ERRORS + 1))
    else
      echo -e "  ${GREEN}No edge function references found.${NC}"
    fi

    # Also check in app code
    APP_REFS=$(grep -rn "$col" app/ lib/ components/ 2>/dev/null || true)
    if [ -n "$APP_REFS" ]; then
      echo -e "  ${RED}[BLOCKED] Column '$col' is referenced in app code:${NC}"
      echo "$APP_REFS" | head -10
      ERRORS=$((ERRORS + 1))
    fi
  done
  echo ""
fi

# 2. Check for DROP TABLE statements
DROP_TABLES=$(grep -iE 'DROP\s+TABLE' "$MIGRATION_FILE" || true)
if [ -n "$DROP_TABLES" ]; then
  echo -e "${RED}[DANGER] DROP TABLE detected:${NC}"
  echo "$DROP_TABLES"
  ERRORS=$((ERRORS + 1))
  echo ""
fi

# 3. Check for ALTER TYPE / RENAME
ALTERS=$(grep -iE 'ALTER\s+TYPE|RENAME\s+COLUMN|RENAME\s+TABLE' "$MIGRATION_FILE" || true)
if [ -n "$ALTERS" ]; then
  echo -e "${YELLOW}[WARNING] ALTER TYPE / RENAME detected:${NC}"
  echo "$ALTERS"
  echo "  Make sure edge functions and app code are updated FIRST."
  echo ""
fi

# 4. Check for NOT NULL without DEFAULT
NOT_NULL=$(grep -iE 'ADD\s+COLUMN.*NOT\s+NULL' "$MIGRATION_FILE" | grep -ivE 'DEFAULT' || true)
if [ -n "$NOT_NULL" ]; then
  echo -e "${YELLOW}[WARNING] NOT NULL column without DEFAULT:${NC}"
  echo "$NOT_NULL"
  echo "  This will fail if the table has existing rows."
  echo ""
fi

# Summary
echo "================================="
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}BLOCKED: $ERRORS issue(s) found. Fix edge functions / app code BEFORE applying this migration.${NC}"
  exit 1
else
  echo -e "${GREEN}OK: No blocking issues found. Safe to apply migration.${NC}"
  exit 0
fi
