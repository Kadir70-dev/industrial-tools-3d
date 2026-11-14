'use client';
import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { siteConfig } from '@/lib/site';

// Office map (MapLibre + OpenFreeMap vector tiles: no API key). The library loads only when the
// section approaches the viewport; without WebGL it degrades to a static card.
const STYLE = 'https://tiles.openfreemap.org/styles/positron';

function circle([lng, lat]: [number, number], km: number) {
  const pts = Array.from({ length: 65 }, (_, i) => {
    const a = (i / 64) * 2 * Math.PI;
    return [lng + (km / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.cos(a), lat + (km / 110.57) * Math.sin(a)];
  });
  return { type: 'Feature' as const, properties: {}, geometry: { type: 'Polygon' as const, coordinates: [pts] } };
}

export default function OfficeMap() {
  const { lat, lng, exact, city } = siteConfig.office;
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'ready' | 'failed'>('idle');

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const centre: [number, number] = [lng, lat];
    let map: import('maplibre-gl').Map | undefined;
    let dead = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      try {
        const ml = (await import('maplibre-gl')).default;
        if (dead) return;
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        map = new ml.Map({ container: el, style: STYLE, center: centre, zoom: exact ? 13 : 9.6, attributionControl: { compact: true }, cooperativeGestures: true, maxZoom: 17 });
        map.addControl(new ml.NavigationControl({ showCompass: false }), 'top-right');
        if (exact) {
          const pin = document.createElement('div');
          pin.className = 'office-pin';
          pin.setAttribute('aria-hidden', 'true');
          new ml.Marker({ element: pin, anchor: 'center' }).setLngLat(centre).addTo(map);
        }
        map.on('load', () => {
          if (!map) return;
          if (!exact) {
            map.addSource('area', { type: 'geojson', data: circle(centre, 9) });
            map.addLayer({ id: 'area-fill', type: 'fill', source: 'area', paint: { 'fill-color': '#f2601e', 'fill-opacity': 0.08 } });
            map.addLayer({ id: 'area-line', type: 'line', source: 'area', paint: { 'line-color': '#121210', 'line-width': 2, 'line-dasharray': [2, 2] } });
          }
          setState('ready');
          map.easeTo({ center: centre, zoom: exact ? 15 : 10.2, pitch: reduce ? 0 : 35, bearing: reduce ? 0 : -10, duration: reduce ? 0 : 2200 });
        });
      } catch {
        if (!dead) setState('failed');
      }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => { dead = true; io.disconnect(); map?.remove(); };
  }, [lat, lng, exact]);

  if (state === 'failed') return <div className="office-map office-map--static"><MapPin size={28} aria-hidden="true" /><p>{city}</p></div>;
  return <div className={`office-map is-${state}`}>
    <div ref={box} className="office-map-canvas" role="region" aria-label={`Map of ${exact ? 'the office location' : city}`} />
    {state === 'idle' && <div className="office-map-skeleton" aria-hidden="true" />}
    {!exact && state === 'ready' && <span className="office-map-flag">Area shown · exact office pin coming soon</span>}
  </div>;
}
