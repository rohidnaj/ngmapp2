'use client';

import { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Loader2,
  Lock,
  Search,
  Filter,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  HelpCircle,
  Eye,
  LogOut,
  RefreshCw,
  Tag,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  property_type: string;
  services: string[];
  message: string | null;
  photo_urls: string[];
  status: 'new' | 'contacted' | 'estimate_sent' | 'won' | 'lost';
  created_at: string;
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected Lead modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Check if passcode is saved in session storage
    const savedPasscode = sessionStorage.getItem('ngm_admin_passcode');
    if (savedPasscode) {
      setPasscode(savedPasscode);
      fetchLeads(savedPasscode);
    }
  }, []);

  const fetchLeads = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: {
          Authorization: `Bearer ${code}`,
        },
      });
      const data = await res.json();

      if (res.status === 401) {
        setPasscodeError('Invalid passcode. Access denied.');
        sessionStorage.removeItem('ngm_admin_passcode');
        setIsAuthorized(false);
      } else if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch leads.');
      } else {
        setLeads(data.leads);
        setIsAuthorized(true);
        sessionStorage.setItem('ngm_admin_passcode', code);
      }
    } catch (err: any) {
      console.error('Fetch leads error:', err);
      setError(err.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setPasscodeError(null);
    fetchLeads(passcode.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ngm_admin_passcode');
    setPasscode('');
    setIsAuthorized(false);
    setLeads([]);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${passcode}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status.');
      }

      // Update locally
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus as any } : lead))
      );
      
      // Update selected lead modal view if open
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update lead status.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to permanently delete this quote request?')) return;
    setDeletingId(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${passcode}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete request.');
      }

      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete request.');
    } finally {
      setDeletingId(null);
    }
  };

  // Status mapping UI helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            New
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            Contacted
          </span>
        );
      case 'estimate_sent':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Estimate Sent
          </span>
        );
      case 'won':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Won
          </span>
        );
      case 'lost':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Lost
          </span>
        );
      default:
        return null;
    }
  };

  // Filter & Search calculation
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.phone && lead.phone.includes(searchQuery)) ||
      (lead.address && lead.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.city && lead.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    estimateSent: leads.filter((l) => l.status === 'estimate_sent').length,
    won: leads.filter((l) => l.status === 'won').length,
  };

  // Login Screen
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 pt-20">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-forest/20">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">Admin Access Required</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Please enter the passcode for Najm Garden & Maintenance Ltd.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode">Admin Passcode</Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-xl"
              />
              {passcodeError && (
                <p className="text-xs font-semibold text-destructive mt-1 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {passcodeError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-forest text-white hover:bg-forest-light"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard UI
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6 border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-forest">
              NGM Ltd. Admin Portal
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Lead Management
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full flex items-center gap-1 border-forest/30 text-forest hover:bg-forest hover:text-white"
            >
              <a href="/edit" target="_blank">
                <Sparkles className="h-4 w-4 text-forest group-hover:text-white" />
                Puck AI Visual Editor
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLeads(passcode)}
              disabled={loading}
              className="rounded-full flex items-center gap-1 border-slate-300"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-forest" />
              ) : (
                <RefreshCw className="h-4 w-4 text-forest" />
              )}
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-full flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-5">
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase">Total Leads</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-2xl font-bold">{stats.total}</span>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">
                New Leads
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.new}</span>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase text-yellow-600 dark:text-yellow-400">
                Contacted
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.contacted}
              </span>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400">
                Estimate Sent
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.estimateSent}
              </span>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white col-span-2 md:col-span-1">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase text-green-600 dark:text-green-400">
                Won (Booked)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.won}</span>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, email, address..."
              className="pl-10 rounded-full border-slate-200 focus-visible:ring-forest"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Filter:
            </span>
            {['all', 'new', 'contacted', 'estimate_sent', 'won', 'lost'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-200',
                  statusFilter === status
                    ? 'bg-forest text-white border-forest shadow-sm'
                    : 'border-slate-200 hover:border-forest/40 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950'
                )}
              >
                {status === 'all'
                  ? 'All Statuses'
                  : status === 'estimate_sent'
                  ? 'Estimate Sent'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table Card */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-950 dark:border-slate-800">
                  <th className="p-4 pl-6">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Services Requested</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {loading && leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-forest" />
                        <p className="text-slate-500 font-medium">Loading requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      No matching quote requests found.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={cn(
                        'hover:bg-slate-50/50 transition-colors duration-150',
                        lead.status === 'new' ? 'bg-forest/[0.01] font-medium' : ''
                      )}
                    >
                      {/* Name & Prop Type */}
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-slate-950 dark:text-white">
                          {lead.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {lead.property_type}
                        </div>
                      </td>

                      {/* Contact details */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-forest transition-colors dark:text-slate-400"
                          >
                            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {lead.email}
                          </a>
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-forest transition-colors dark:text-slate-400"
                            >
                              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              {lead.phone}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No phone</span>
                          )}
                        </div>
                      </td>

                      {/* Address / City */}
                      <td className="p-4 max-w-[200px] truncate">
                        <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            {lead.address || 'Address not provided'}
                            {lead.city && <span className="block text-slate-400 text-[10px]">{lead.city} {lead.postal_code}</span>}
                          </div>
                        </div>
                      </td>

                      {/* Services requested tags */}
                      <td className="p-4 max-w-[250px]">
                        <div className="flex flex-wrap gap-1">
                          {lead.services.slice(0, 3).map((svc) => (
                            <span
                              key={svc}
                              className="inline-block bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 rounded px-2 py-0.5"
                            >
                              {svc}
                            </span>
                          ))}
                          {lead.services.length > 3 && (
                            <span className="inline-block bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 rounded px-2 py-0.5">
                              +{lead.services.length - 3} more
                            </span>
                          )}
                          {lead.services.length === 0 && (
                            <span className="text-xs text-slate-400 italic">None specified</span>
                          )}
                        </div>
                      </td>

                      {/* Status select dropdown */}
                      <td className="p-4">
                        {updatingStatus === lead.id ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-forest" />
                            Saving...
                          </div>
                        ) : (
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="bg-transparent border-0 font-semibold text-xs p-0 text-slate-900 focus:ring-0 dark:text-white cursor-pointer hover:underline"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="estimate_sent">Estimate Sent</option>
                            <option value="won">Won (Booked)</option>
                            <option value="lost">Lost</option>
                          </select>
                        )}
                      </td>

                      {/* Date submitted */}
                      <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(lead.created_at).toLocaleDateString('en-CA', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* View details & delete actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedLead(lead)}
                            className="h-8 rounded-full border-slate-300 text-xs flex items-center gap-1 hover:border-forest/50 hover:bg-forest/5"
                          >
                            <Eye className="h-3.5 w-3.5 text-forest" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteLead(lead.id)}
                            disabled={deletingId === lead.id}
                            className="h-8 w-8 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950/20 dark:hover:bg-red-950/10"
                            aria-label="Delete request"
                          >
                            {deletingId === lead.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Selected Lead Modal Dialog */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-scale-in">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-forest">
                  Quote Details
                </span>
                <h2 className="text-2xl font-bold mt-1">{selectedLead.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Submitted: {new Date(selectedLead.created_at).toLocaleString('en-CA')}
                  </span>
                  <span>|</span>
                  <span className="font-semibold">{selectedLead.property_type} Property</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400"
              >
                &times;
              </button>
            </div>

            {/* Content body */}
            <div className="mt-6 space-y-6">
              {/* Contact info grid */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 bg-slate-50 p-4 rounded-2xl dark:bg-slate-950">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-sm font-medium hover:underline text-forest break-all block"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Phone Number
                  </span>
                  {selectedLead.phone ? (
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="text-sm font-medium hover:underline text-forest block"
                    >
                      {selectedLead.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Not provided</span>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Property Address
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block">
                    {selectedLead.address || 'Address not provided'}
                    {selectedLead.city && <span className="block text-xs font-normal text-slate-400">{selectedLead.city}, {selectedLead.postal_code}</span>}
                  </span>
                </div>
              </div>

              {/* Lead Status Select in Modal */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-slate-100 dark:border-slate-800 p-4 rounded-2xl gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Lead Status:</span>
                  {getStatusBadge(selectedLead.status)}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="modal-status" className="text-xs">Update Status:</Label>
                  <select
                    id="modal-status"
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="rounded-xl border-slate-200 text-xs font-semibold py-1.5 focus:ring-forest bg-background"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="estimate_sent">Estimate Sent</option>
                    <option value="won">Won (Booked)</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Requested Services */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  Services Requested ({selectedLead.services.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLead.services.map((svc) => (
                    <span
                      key={svc}
                      className="bg-forest/10 dark:bg-forest/20 text-forest text-xs font-semibold rounded-full px-3 py-1"
                    >
                      {svc}
                    </span>
                  ))}
                  {selectedLead.services.length === 0 && (
                    <span className="text-sm text-slate-400 italic">No services selected.</span>
                  )}
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project Details / Message
                </h4>
                <div className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap dark:bg-slate-900">
                  {selectedLead.message || (
                    <span className="text-slate-400 italic">No project description provided.</span>
                  )}
                </div>
              </div>

              {/* Photo attachments */}
              {selectedLead.photo_urls && selectedLead.photo_urls.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Uploaded Photos ({selectedLead.photo_urls.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {selectedLead.photo_urls.map((url, i) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 hover:border-forest/50 transition-all shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Uploaded yard view ${i + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink className="h-5 w-5 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 border-t border-slate-100 pt-4 dark:border-slate-800 flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950/20 dark:hover:bg-red-950/10 flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete Request
              </Button>
              <Button
                onClick={() => setSelectedLead(null)}
                className="rounded-full bg-forest text-white hover:bg-forest-light"
              >
                Close View
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
