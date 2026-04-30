#!/usr/bin/env bash
# regen-types.sh
# Regenerate Supabase TypeScript types after any migration.
# Usage: ./scripts/regen-types.sh

set -euo pipefail

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Check for supabase CLI
if ! command -v supabase &>/dev/null; then
  echo -e "${RED}supabase CLI not found. Install: npx supabase --version${NC}"
  exit 1
fi

OUTPUT_FILE="lib/supabase/database.types.ts"

echo -e "${YELLOW}Regenerating Supabase types...${NC}"

# Try linked project first, fall back to local
if supabase gen types typescript --linked > "$OUTPUT_FILE" 2>/dev/null; then
  echo -e "${GREEN}Types generated from linked project → $OUTPUT_FILE${NC}"
elif supabase gen types typescript --local > "$OUTPUT_FILE" 2>/dev/null; then
  echo -e "${GREEN}Types generated from local DB → $OUTPUT_FILE${NC}"
else
  echo -e "${RED}Failed to generate types. Make sure you're linked (supabase link) or running locally (supabase start).${NC}"
  exit 1
fi

# Quick sanity check
if grep -q "reparations_fallback" "$OUTPUT_FILE"; then
  echo -e "${GREEN}  ✓ reparations_fallback table found in types${NC}"
else
  echo -e "${YELLOW}  ⚠ reparations_fallback table NOT found — check migration${NC}"
fi

if grep -q "reparations" "$OUTPUT_FILE"; then
  echo -e "${GREEN}  ✓ reparations table found in types${NC}"
fi

echo -e "${GREEN}Done. Don't forget to commit the updated types file.${NC}"
