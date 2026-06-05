'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'alia_user_location';

/**
 * Haversine formula — distance en km entre deux points GPS
 */
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Hook de géolocalisation avec fallback IP
 * Retourne { location: { lat, lng, city }, loading, error }
 */
export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Cache localStorage
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cache valide 12 heures
        if (Date.now() - parsed.ts < 12 * 60 * 60 * 1000) {
          setLocation(parsed);
          setLoading(false);
          return;
        }
      }
    } catch (_) {}

    const saveAndSet = (loc) => {
      const payload = { ...loc, ts: Date.now() };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch (_) {}
      setLocation(payload);
      setLoading(false);
    };

    // 2. API Navigateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          saveAndSet({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            city: 'Ma position',
          });
        },
        () => {
          // 3. Fallback via IP (ipapi.co — gratuit, sans clé)
          fetch('https://ipapi.co/json/')
            .then((r) => r.json())
            .then((d) => {
              if (d.latitude) {
                saveAndSet({ lat: d.latitude, lng: d.longitude, city: d.city || 'Localisation IP' });
              } else {
                setError('Impossible de déterminer votre position.');
                setLoading(false);
              }
            })
            .catch(() => {
              setError('Géolocalisation indisponible.');
              setLoading(false);
            });
        },
        { timeout: 6000 }
      );
    } else {
      // Navigateur sans support géoloc → fallback IP
      fetch('https://ipapi.co/json/')
        .then((r) => r.json())
        .then((d) => {
          if (d.latitude) {
            saveAndSet({ lat: d.latitude, lng: d.longitude, city: d.city || 'Localisation IP' });
          } else {
            setError('Géolocalisation non supportée.');
            setLoading(false);
          }
        })
        .catch(() => {
          setError('Géolocalisation indisponible.');
          setLoading(false);
        });
    }
  }, []);

  return { location, loading, error };
}
