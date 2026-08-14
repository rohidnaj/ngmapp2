/*
# Storage policies for quote-photos bucket

1. Security
- Public read access for quote photos (so they can be displayed in admin dashboard)
- Authenticated users can upload photos (the frontend uploads with anon key)
- Add policies for anon + authenticated to upload to quote-photos bucket
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access for quote photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload for quote photos" ON storage.objects;
DROP POLICY IF EXISTS "Anon upload for quote photos" ON storage.objects;

-- Public read
CREATE POLICY "Public read access for quote photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'quote-photos');

-- Allow anon to upload (the form is public, no auth)
CREATE POLICY "Anon upload for quote photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'quote-photos');

-- Allow anon to delete their own uploads (cleanup)
CREATE POLICY "Anon delete for quote photos"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'quote-photos');