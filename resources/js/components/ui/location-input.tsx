import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LocationInputProps = {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  error?: string;
};

export function LocationInput({ value, onChange, error }: LocationInputProps) {
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.google && locationInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current, {
        types: ['geocode'],
        fields: ['formatted_address', 'geometry'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;

        onChange(address, lat, lng);
      });
    }
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        ref={locationInputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Event venue and address"
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
