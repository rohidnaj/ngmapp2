'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, Camera, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase-client';
import { quoteServiceOptions } from '@/lib/site-data';

interface QuoteFormProps {
  compact?: boolean;
}

export function QuoteForm({ compact = false }: QuoteFormProps) {
  // Contact Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Property details
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial'>('Residential');
  
  // Services & Message
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  
  // Honeypot spam protection
  const [website, setWebsite] = useState('');
  
  // Photo upload states
  const [uploading, setUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ name: string; url: string; path: string }>>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form submission status
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check limits
    if (uploadedPhotos.length + files.length > 5) {
      setUploadError('You can upload a maximum of 5 photos.');
      return;
    }

    setUploadError(null);
    setUploading(true);
    const newUploaded = [...uploadedPhotos];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File "${file.name}" is too large. Max size is 5MB.`);
        continue;
      }

      // Unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      try {
        const { error: supabaseError } = await supabase.storage
          .from('quote-photos')
          .upload(filePath, file);

        if (supabaseError) {
          // If storage isn't fully set up/migrated yet, log it and alert user
          console.error('Supabase upload error:', supabaseError);
          setUploadError('Failed to upload images. We will request them during consultation.');
          break;
        }

        const { data } = supabase.storage.from('quote-photos').getPublicUrl(filePath);
        newUploaded.push({ name: file.name, url: data.publicUrl, path: filePath });
      } catch (err) {
        console.error('File upload catch block:', err);
        setUploadError('Failed to upload image. Please try again.');
      }
    }

    setUploadedPhotos(newUploaded);
    setUploading(false);
  };

  const handleDeletePhoto = async (index: number) => {
    const photo = uploadedPhotos[index];
    try {
      await supabase.storage.from('quote-photos').remove([photo.path]);
    } catch (err) {
      console.error('Failed to delete photo from storage:', err);
    }
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          city,
          postal_code: postalCode,
          property_type: propertyType,
          services: selectedServices,
          message,
          photo_urls: uploadedPhotos.map((p) => p.url),
          website, // honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request.');
      }

      setStatus('success');
      
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setPostalCode('');
      setSelectedServices([]);
      setMessage('');
      setUploadedPhotos([]);
      setWebsite('');
    } catch (err: any) {
      console.error('Quote form submit error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again or call us at 778-233-1599.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-lg animate-scale-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
          <CheckCircle2 className="h-8 w-8 text-forest" />
        </div>
        <h3 className="mt-6 text-xl font-semibold">Quote Request Received!</h3>
        <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
          Thank you for reaching out to Najm Garden & Maintenance Ltd. We have saved your request
          and sent a confirmation email. Our team will review the details and contact you shortly.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full border-forest/30 text-forest hover:bg-forest hover:text-white"
          onClick={() => setStatus('idle')}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 space-y-6"
    >
      {status === 'error' && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot Spam Protection Field */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Customer Information */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-forest/70 mb-4">
          Customer Information
        </h3>
        <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'sm:grid-cols-2')}>
          <div className="space-y-2">
            <Label htmlFor="qf-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="rounded-xl border-border bg-muted/20 focus:border-forest/50 focus:ring-forest"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qf-email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="qf-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="rounded-xl border-border bg-muted/20 focus:border-forest/50 focus:ring-forest"
            />
          </div>
          <div className={cn('space-y-2', compact ? '' : 'sm:col-span-2')}>
            <Label htmlFor="qf-phone">Phone Number</Label>
            <Input
              id="qf-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="778-233-1599"
              className="rounded-xl border-border bg-muted/20 focus:border-forest/50 focus:ring-forest"
            />
          </div>
        </div>
      </div>

      {/* Property Information */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-forest/70 mb-4 pt-2">
          Property Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3 space-y-2">
            <Label htmlFor="qf-address">Property Address</Label>
            <Input
              id="qf-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
              className="rounded-xl border-border bg-muted/20 focus:border-forest/50 focus:ring-forest"
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="qf-city">City</Label>
            <Input
              id="qf-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Maple Ridge"
              className="rounded-xl border-border bg-muted/20 focus:border-forest/50 focus:ring-forest"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qf-postal">Postal Code</Label>
            <Input
              id="qf-postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="V2X 0Y8"
              className="rounded-xl border-border bg-muted/20 focus:border-forest/50 focus:ring-forest"
            />
          </div>
          <div className="sm:col-span-3 space-y-2">
            <Label>Property Type</Label>
            <div className="flex gap-3">
              {(['Residential', 'Commercial'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={cn(
                    'flex-1 rounded-xl border py-3 text-sm font-medium transition-all duration-300',
                    propertyType === type
                      ? 'border-forest bg-forest/5 text-forest font-semibold'
                      : 'border-border text-muted-foreground hover:border-forest/30'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Needed */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-forest/70 mb-4 pt-2">
          Services Requested
        </h3>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground block mb-2">
            Select all that apply:
          </Label>
          <div className="flex flex-wrap gap-2">
            {quoteServiceOptions.map((service) => {
              const active = selectedServices.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300',
                    active
                      ? 'border-forest bg-forest text-white shadow-sm'
                      : 'border-border text-muted-foreground hover:border-forest/40 hover:text-foreground'
                  )}
                >
                  {service}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-2">
        <Label htmlFor="qf-message">Project Details</Label>
        <Textarea
          id="qf-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about the work you need done on your property..."
          rows={4}
          className="rounded-xl border-border bg-muted/20 focus:border-forest/50 focus:ring-forest resize-y"
        />
      </div>

      {/* Photo Uploads */}
      <div className="space-y-3 pt-2">
        <Label>Upload Property Photos (Optional)</Label>
        <p className="text-xs text-muted-foreground leading-normal">
          Provide photos of your yard or garden areas to help us prepare your estimate. Up to 5 photos (max 5MB each).
        </p>

        {uploadError && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {uploadError}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {uploadedPhotos.map((photo, i) => (
            <div key={photo.path} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeletePhoto(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete photo"
              >
                <Trash2 className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}

          {uploadedPhotos.length < 5 && (
            <label className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border transition-colors hover:bg-muted/30",
              uploading ? "pointer-events-none opacity-60" : ""
            )}>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleFileChange}
              />
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-forest" />
              ) : (
                <>
                  <Camera className="h-6 w-6 text-muted-foreground" />
                  <span className="mt-1 text-[10px] font-medium text-muted-foreground">Add Photo</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={status === 'loading' || uploading}
        className="w-full rounded-full bg-forest text-white py-6 text-base font-semibold transition-all duration-300 hover:bg-forest-light hover:shadow-lg disabled:opacity-50"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting Quote Request...
          </>
        ) : (
          'Request Free Quote'
        )}
      </Button>
    </form>
  );
}
