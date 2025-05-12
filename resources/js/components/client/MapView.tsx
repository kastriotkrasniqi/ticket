import { useEffect, useRef } from 'react';

export default function MapView({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label?: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google && mapContainerRef.current) {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat, lng },
        zoom: 13,
      });

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: label,
      });

      if (label) {
        const infowindow = new window.google.maps.InfoWindow({
          content: label,
        });
        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });
      }
    }
  }, [lat, lng, label]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%' }}
    />
  );
}
