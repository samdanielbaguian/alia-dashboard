/**
 * Sales Map Widget Component
 * Displays sales zones on Google Map with pins and density visualization
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';
import { LocationOn as LocationIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { formatCurrency } from '@/utils/helpers';

export default function SalesMapWidget({ title = "Zones de Vente", data = [] }) {
  const [viewMode, setViewMode] = useState('pins'); // 'pins' or 'heatmap'
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const heatmapRef = useRef(null);

  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMaps = () => {
      if (typeof window === 'undefined') return;
      
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      // For demo purposes without actual Google Maps API key, we'll use a static map
      // In production, uncomment the following and add your API key to .env.local
      // as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      /*
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=visualization`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
      */
      
      // Demo mode - render custom visualization (handled by SVG below)
    };

    loadGoogleMaps();

    return () => {
      // Cleanup markers and heatmap
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker && marker.setMap && marker.setMap(null));
      }
      if (heatmapRef.current) {
        heatmapRef.current.setMap && heatmapRef.current.setMap(null);
      }
    };
  }, [data]);

  useEffect(() => {
    // Update visualization when view mode changes
    if (mapInstanceRef.current) {
      updateVisualization();
    }
  }, [viewMode]);

  const initMap = () => {
    if (!mapRef.current || typeof window === 'undefined' || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 46.603354, lng: 1.888334 }, // Center of France
      zoom: 6,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;
    updateVisualization();
  };

  const updateVisualization = () => {
    if (!mapInstanceRef.current || typeof window === 'undefined' || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Clear existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    if (viewMode === 'pins') {
      // Add markers with info windows
      data.forEach(zone => {
        const marker = new window.google.maps.Marker({
          position: { lat: zone.lat, lng: zone.lng },
          map: mapInstanceRef.current,
          title: zone.city,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: zone.density === 'high' ? 12 : zone.density === 'medium' ? 8 : 6,
            fillColor: zone.density === 'high' ? '#f44336' : zone.density === 'medium' ? '#ff9800' : '#4caf50',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1976d2;">${zone.city}</h3>
              <p style="margin: 4px 0; color: #666;"><strong>Région:</strong> ${zone.region}</p>
              <p style="margin: 4px 0; color: #666;"><strong>Ventes:</strong> ${zone.sales}</p>
              <p style="margin: 4px 0; color: #666;"><strong>Revenu:</strong> ${formatCurrency(zone.revenue)}</p>
              <p style="margin: 4px 0; color: #666;"><strong>Densité:</strong> ${zone.density}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
      });
    } else {
      // Add heatmap
      const heatmapData = data.map(zone => ({
        location: new window.google.maps.LatLng(zone.lat, zone.lng),
        weight: zone.sales / 10 // Normalize weight
      }));

      heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 50,
        opacity: 0.6
      });

      heatmapRef.current.setMap(mapInstanceRef.current);
    }
  };

  const getDensityColor = (density) => {
    switch (density) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#1976d2';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="pins">
              Pins
            </ToggleButton>
            <ToggleButton value="heatmap">
              Heatmap
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Map Container - For production with Google Maps API */}
        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: 400,
            borderRadius: 1,
            backgroundColor: '#f5f5f5',
            display: typeof window !== 'undefined' && window.google ? 'block' : 'none'
          }}
        />

        {/* Demo Fallback - SVG visualization when Google Maps is not loaded */}
        {(typeof window === 'undefined' || !window.google) && (
          <Box sx={{ width: '100%', height: 400, position: 'relative', backgroundColor: '#e3f2fd', borderRadius: 1, overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 400">
              {/* Simple map outline of France */}
              <path
                d="M 250 80 L 280 70 L 320 75 L 350 90 L 380 120 L 400 160 L 410 200 L 405 240 L 390 280 L 360 320 L 320 350 L 280 360 L 240 355 L 200 340 L 170 310 L 150 270 L 140 230 L 145 190 L 160 150 L 180 120 L 210 95 L 250 80 Z"
                fill="#ffffff"
                stroke="#1976d2"
                strokeWidth="2"
                opacity="0.5"
              />

              {/* Pins or Heatmap circles based on viewMode */}
              {data.map((zone, index) => {
                // Simple projection: normalize lat/lng to SVG coordinates
                const x = 250 + (zone.lng - 1.888334) * 50;
                const y = 200 - (zone.lat - 46.603354) * 50;
                const size = zone.density === 'high' ? 20 : zone.density === 'medium' ? 15 : 10;
                const color = getDensityColor(zone.density);

                if (viewMode === 'pins') {
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r={size}
                        fill={color}
                        fillOpacity="0.8"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <title>{`${zone.city}: ${zone.sales} ventes, ${formatCurrency(zone.revenue)}`}</title>
                    </g>
                  );
                } else {
                  // Heatmap style - larger, more transparent circles
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r={size * 3}
                      fill={color}
                      fillOpacity="0.3"
                      stroke="none"
                    >
                      <title>{`${zone.city}: ${zone.sales} ventes`}</title>
                    </circle>
                  );
                }
              })}
            </svg>

            {/* Legend */}
            <Paper
              elevation={2}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                p: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Densité
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f44336', mr: 1 }} />
                <Typography variant="caption">Haute</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff9800', mr: 1 }} />
                <Typography variant="caption">Moyenne</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4caf50', mr: 1 }} />
                <Typography variant="caption">Faible</Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Statistics Summary */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          {['high', 'medium', 'low'].map(density => {
            const zones = data.filter(z => z.density === density);
            const totalSales = zones.reduce((sum, z) => sum + z.sales, 0);
            const totalRevenue = zones.reduce((sum, z) => sum + z.revenue, 0);

            return (
              <Paper key={density} sx={{ flex: 1, minWidth: 150, p: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Densité {density === 'high' ? 'Haute' : density === 'medium' ? 'Moyenne' : 'Faible'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: getDensityColor(density) }}>
                  {zones.length} zones
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalSales} ventes • {formatCurrency(totalRevenue)}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
