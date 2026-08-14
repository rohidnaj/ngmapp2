/*
# Create quote_requests table (single-tenant, no auth)

1. New Tables
- `quote_requests`
  - `id` (uuid, primary key)
  - `name` (text, not null) — customer name
  - `email` (text, not null) — customer email
  - `phone` (text) — customer phone
  - `address` (text) — property address
  - `property_type` (text) — Residential or Commercial
  - `services` (text[]) — array of requested services
  - `message` (text) — additional details
  - `status` (text, default 'new') — request status
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `quote_requests`.
- Allow anon + authenticated to INSERT (public form submissions).
- No SELECT/UPDATE/DELETE for anon (only the owner reads these via the dashboard).
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  property_type text,
  services text[] DEFAULT '{}',
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_quote_requests" ON quote_requests;
CREATE POLICY "anon_insert_quote_requests"
ON quote_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- Index for sorting by most recent
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests (created_at DESC);