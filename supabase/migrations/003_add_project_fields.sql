-- Add new project detail fields for the ProjectCard component
-- Run this in your Supabase SQL Editor

ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'building';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS launched_date TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS audience TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mrr TEXT DEFAULT '€0';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metric1_value TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metric1_label TEXT DEFAULT 'users';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metric2_value TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metric2_label TEXT DEFAULT 'visits/mo';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS wants_needs TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS blocker TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_name TEXT DEFAULT 'Tay';
