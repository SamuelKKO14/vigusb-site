-- Table: reservations
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  ticket_id text unique not null,
  prenom text not null,
  nom text not null,
  telephone text not null,
  email text not null,
  magasin_id integer,
  marque text not null,
  modele text not null,
  pannes text[] default '{}',
  statut text default 'en_attente',
  created_at timestamptz default now()
);

-- Table: produits
create table if not exists produits (
  id uuid primary key default gen_random_uuid(),
  marque text not null,
  modele text not null,
  stockage text,
  etat text not null,
  prix integer not null,
  description text,
  disponible boolean default true,
  magasin_id integer,
  created_at timestamptz default now()
);
