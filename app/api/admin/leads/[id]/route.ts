import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// PATCH to update status of a lead
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const passcode = getPasscode(req);
    if (!verifyAuth(passcode)) {
      return NextResponse.json({ error: 'Unauthorized. Invalid admin passcode.' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ['new', 'contacted', 'estimate_sent', 'won', 'lost'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid lead status.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('quote_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Update status database error:', error);
      return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Leads PATCH api error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// DELETE a lead
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const passcode = getPasscode(req);
    if (!verifyAuth(passcode)) {
      return NextResponse.json({ error: 'Unauthorized. Invalid admin passcode.' }, { status: 401 });
    }

    const { id } = params;

    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete lead database error:', error);
      return NextResponse.json({ error: 'Failed to delete request.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Leads DELETE api error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
