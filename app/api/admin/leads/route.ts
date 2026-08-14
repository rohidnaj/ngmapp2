import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force this route to be dynamic (server-side) so Next.js doesn't attempt static generation
export const dynamic = 'force-dynamic';

// Setup service-role client to bypass RLS securely on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

function getPasscode(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

function verifyAuth(passcode: string | null): boolean {
  const correctPassword = process.env.ADMIN_PASSWORD || 'ngm-admin-2026';
  return passcode !== null && passcode === correctPassword;
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
