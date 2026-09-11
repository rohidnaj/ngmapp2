import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force this route to be dynamic (server-side) so Next.js doesn't attempt static generation
export const dynamic = 'force-dynamic';

// Setup service-role client to bypass RLS securely on the server
const DEFAULT_SUPABASE_URL = 'https://ezlhqlohllxhthatlwwf.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bGhxbG9obGx4aHRoYXRsd3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODkwOTUsImV4cCI6MjEwMjE2NTA5NX0.d60hv0hQwT1MpzcCDK-1WSmmSpp6-FM2VU-XChZqV8U';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getPasscode(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

function verifyAuth(passcode: string | null): boolean {
  const correctPassword = (process.env.ADMIN_PASSWORD || 'ngm-admin-2026').trim();
  return passcode !== null && passcode.trim() === correctPassword;
}

export async function GET(req: Request) {
  try {
    const passcode = getPasscode(req);
    if (!verifyAuth(passcode)) {
      return NextResponse.json({ error: 'Unauthorized. Invalid admin passcode.' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch leads database error:', error);
      return NextResponse.json({ error: 'Failed to fetch quote requests.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, leads: data });
  } catch (err) {
    console.error('Leads GET api error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
