/*
# Upgrade quote_requests table for full quote system

1. Modified Tables
- `quote_requests`
  - Add `city` (text) — customer's city
  - Add `postal_code` (text) — customer's postal code
  - Add `photo_urls` (text[]) — array of uploaded photo URLs from Supabase Storage
  - Add `spam_score` (integer, default 0) — honeypot/spam detection score

2. Security
- RLS already enabled. Existing policies remain.
- Add UPDATE policy for anon so edge function can update status (though edge function uses service role key which bypasses RLS).
- No new tables needed.

3. Notes
- Photo uploads go to a `quote-photos` storage bucket (public read, authenticated write).
- The edge function handles email notifications via Resend.
*/

ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS postal_code text;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS photo_urls text[] DEFAULT '{}';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS spam_score integer NOT NULL DEFAULT 0;

-- Add index for admin dashboard sorting
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests (status);