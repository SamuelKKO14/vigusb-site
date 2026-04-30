# CLAUDE.md — Vigus'B Dashboard

## Projet
Dashboard interne de gestion des réparations pour les 14 magasins Vigus'B.
Stack : Next.js 14 (App Router) + Supabase (Postgres, Edge Functions, Auth, Storage).

## Conventions
- Langue UI : français, vouvoiement exclusif
- Couleurs brand : violet `#7B2D8B`, vert `#8DB542`
- Police : Poppins uniquement
- Composants UI : shadcn/ui (via `@/components/ui`)

## DB Migration Rules — OBLIGATOIRE

### Avant toute migration
1. **Lancer l'audit** : `./scripts/pre-migration-audit.sh <fichier.sql>`
2. **Jamais de DROP COLUMN/TABLE sans vérification** : le script vérifie que la colonne/table n'est pas référencée dans les edge functions (`supabase/functions/`) ni dans le code app (`app/`, `lib/`, `components/`).
3. **Ordre des opérations** :
   - D'abord : déployer le code qui ne dépend plus de la colonne/table
   - Ensuite : appliquer la migration SQL
   - Jamais l'inverse (sinon edge function INSERT dans colonnes supprimées = 500 silencieux)

### Après toute migration
1. **Regénérer les types** : `./scripts/regen-types.sh`
2. **Vérifier le build** : `npm run build`
3. **Committer les types** avec la migration

### Principes
- Toute colonne NOT NULL doit avoir un DEFAULT
- Préférer ADD COLUMN + backfill + NOT NULL constraint en 2 étapes
- Ne jamais RENAME une colonne encore utilisée par une edge function
- En cas de doute, créer une nouvelle colonne et migrer les données, puis supprimer l'ancienne

## Fallback System
- Table `reparations_fallback` : filet de sécurité pour les réparations du tunnel Shopify
- Edge function `create-reparation-fallback` : toujours retourne 200, stocke le payload brut
- Page admin `/dashboard/fallback` : permet de récupérer les entrées et les re-soumettre
- Tunnel JS (`repair-tunnel-ui.js`) : 3 retries → fallback API → localStorage

## Monitoring
- GitHub Actions smoke test toutes les 15 min : `.github/workflows/smoke-test.yml`
- Edge function `health-check` : vérifie DB reparations, magasins, storage, fallback
- Secrets requis dans GitHub : `SUPABASE_URL`, `SUPABASE_ANON_KEY`
