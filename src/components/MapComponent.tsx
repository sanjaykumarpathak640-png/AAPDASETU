'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  Shield,
  AlertTriangle,
  Hospital as HospitalIcon,
  Truck,
  Activity,
  LifeBuoy,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  showAdminLayers?: boolean;
  selectedZoneId?: string;
  onSelectZone?: (zone: any) => void;
}

// Client-only map wrapper to handle Leaflet SSR avoidance
const LeafletMapInner: React.FC<MapComponentProps> = ({
  center = [25.75, 85.75], // Bihar central region
  zoom = 9,
  showAdminLayers = false,
  onSelectZone,
}) => {
  const [L, setL] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Layer toggles
  const [layers, setLayers] = useState({
    riskZones: true,
    shelters: true,
    hospitals: true,
    reliefResources: true,
    roads: true,
    sensors: true,
    sos: showAdminLayers,
  });

  // Layer data
  const [riskZones, setRiskZones] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [reliefCenters, setReliefCenters] = useState<any[]>([]);
  const [roads, setRoads] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);
  const [sosCases, setSosCases] = useState<any[]>([]);

  // Load Leaflet dynamically on mount
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default || leaflet);
    });
  }, []);

  // Fetch layer data
  useEffect(() => {
    Promise.all([
      fetch('/api/risk-zones').then((r) => r.json()).catch(() => []),
      fetch('/api/shelters').then((r) => r.json()).catch(() => []),
      fetch('/api/hospitals').then((r) => r.json()).catch(() => []),
      fetch('/api/resources').then((r) => r.json()).catch(() => []),
      fetch('/api/road-conditions').then((r) => r.json()).catch(() => []),
      fetch('/api/sensors').then((r) => r.json()).catch(() => []),
      fetch('/api/sos').then((r) => r.json()).catch(() => []),
    ]).then(([zones, shs, hos, res, rds, sns, sos]) => {
      setRiskZones(Array.isArray(zones) ? zones : []);
      // Map shelter objects from ranked results
      setShelters(Array.isArray(shs) ? shs.map((s: any) => s.shelter || s) : []);
      setHospitals(Array.isArray(hos) ? hos : []);
      setReliefCenters(Array.isArray(res) ? res : []);
      setRoads(Array.isArray(rds) ? rds : []);
      setSensors(Array.isArray(sns) ? sns : []);
      setSosCases(Array.isArray(sos) ? sos : []);
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!L || mapInstance) return;

    const map = L.map('aapdasetu-leaflet-container', {
      center: center,
      zoom: zoom,
      scrollWheelZoom: true,
    });

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | AAPDASETU Demo Telemetry',
      maxZoom: 18,
    }).addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, [L]);

  // Render Markers and Polygons whenever data or layer toggles change
  useEffect(() => {
    if (!L || !mapInstance) return;

    // Clear existing dynamic feature groups
    const layersToClear: any[] = [];
    mapInstance.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polyline) {
        layersToClear.push(layer);
      }
    });
    layersToClear.forEach((l) => mapInstance.removeLayer(l));

    // Custom Icon helper
    const createCustomIcon = (bgColor: string, text: string) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">${text}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    };

    // 1. Risk Zones (Circles with severity colors)
    if (layers.riskZones) {
      riskZones.forEach((z) => {
        const colorMap: Record<string, string> = {
          EXTREME: '#ef4444',
          HIGH: '#f97316',
          MODERATE: '#f59e0b',
          LOW: '#10b981',
        };
        const color = colorMap[z.riskLevel] || '#f59e0b';
        const circle = L.circle([z.centerLat, z.centerLng], {
          radius: z.riskLevel === 'EXTREME' ? 14000 : z.riskLevel === 'HIGH' ? 11000 : 8000,
          color: color,
          fillColor: color,
          fillOpacity: 0.28,
          weight: 2,
        }).addTo(mapInstance);

        circle.bindPopup(`
          <div style="font-family: sans-serif; min-width: 190px;">
            <div style="font-weight: bold; font-size: 13px; color: #0f172a; margin-bottom: 4px;">${z.name}</div>
            <div style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: ${color}20; color: ${color}; margin-bottom: 6px;">${z.riskLevel} RISK (${z.riskScore}/100)</div>
            <div style="font-size: 11px; color: #475569; line-height: 1.4;">
              <div>District: <strong>${z.district}</strong></div>
              <div>Est. Population: <strong>${z.population.toLocaleString()}</strong></div>
              <div>Rainfall: <strong>${z.rainfallMm} mm</strong></div>
              <div>River: <strong>${z.primaryRiver || 'Basin Channel'}</strong></div>
            </div>
            <div style="margin-top: 8px; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 4px;">Demo Zone Assessment</div>
          </div>
        `);

        circle.on('click', () => {
          if (onSelectZone) onSelectZone(z);
        });
      });
    }

    // 2. Shelters
    if (layers.shelters) {
      shelters.forEach((s) => {
        const marker = L.marker([s.latitude, s.longitude], {
          icon: createCustomIcon('#2563eb', '🏠'),
        }).addTo(mapInstance);

        const occPct = s.totalCapacity ? Math.round((s.occupiedCapacity / s.totalCapacity) * 100) : 0;
        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 210px;">
            <div style="font-weight: bold; font-size: 13px; color: #1e3a8a;">${s.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${s.address}</div>
            <div style="font-size: 11px; color: #334155; margin-bottom: 6px;">
              <div>Available Beds: <strong>${s.availableBeds} / ${s.totalCapacity}</strong></div>
              <div>Occupancy: <strong>${occPct}%</strong> (${s.operationalStatus})</div>
              <div>Food: ${s.hasFood ? '✅ Yes' : '❌ No'} | Potable Water: ${s.hasDrinkingWater ? '✅ Yes' : '❌ No'}</div>
              <div>Medical Post: ${s.hasMedical ? '✅ Yes' : '❌ No'}</div>
            </div>
            <a href="/shelters" style="display: block; text-align: center; background: #2563eb; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; text-decoration: none; font-weight: bold;">View Details & Route</a>
          </div>
        `);
      });
    }

    // 3. Hospitals
    if (layers.hospitals) {
      hospitals.forEach((h) => {
        const marker = L.marker([h.latitude, h.longitude], {
          icon: createCustomIcon('#dc2626', '🏥'),
        }).addTo(mapInstance);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 190px;">
            <div style="font-weight: bold; font-size: 13px; color: #991b1b;">${h.name}</div>
            <div style="font-size: 11px; color: #64748b;">${h.address}</div>
            <div style="font-size: 11px; margin-top: 4px;">
              <div>Emergency Beds: <strong>${h.availableBeds} available</strong></div>
              <div>Trauma Care: ${h.traumaCareAvailable ? '✅ 24x7 Ready' : 'Standard'}</div>
              <div>Helpline: <strong>${h.contactPhone || '108'}</strong></div>
            </div>
          </div>
        `);
      });
    }

    // 4. Relief Centers
    if (layers.reliefResources) {
      reliefCenters.forEach((r) => {
        const marker = L.marker([r.latitude, r.longitude], {
          icon: createCustomIcon('#059669', '📦'),
        }).addTo(mapInstance);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 190px;">
            <div style="font-weight: bold; font-size: 13px; color: #065f46;">${r.name}</div>
            <div style="font-size: 11px; color: #64748b;">${r.centerType} Supply Hub</div>
            <div style="font-size: 11px; margin-top: 4px;">
              <div>Contact: ${r.contactPerson || 'Dispatch Officer'}</div>
              <div>Phone: ${r.contactPhone || 'Not listed'}</div>
            </div>
            <a href="/resources" style="display: inline-block; margin-top: 6px; font-size: 11px; color: #059669; font-weight: bold;">Check Stock Inventory &rarr;</a>
          </div>
        `);
      });
    }

    // 5. Sensors
    if (layers.sensors) {
      sensors.forEach((sn) => {
        const isDanger = sn.status === 'DANGER';
        const isWarning = sn.status === 'WARNING';
        const badgeColor = isDanger ? '#dc2626' : isWarning ? '#d97706' : '#16a34a';

        const marker = L.marker([sn.latitude, sn.longitude], {
          icon: createCustomIcon(badgeColor, '📊'),
        }).addTo(mapInstance);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px;">
            <div style="font-weight: bold; font-size: 12px; color: #1e293b;">${sn.name}</div>
            <div style="font-size: 10px; color: #64748b;">${sn.riverName} • ${sn.district}</div>
            <div style="font-size: 11px; margin-top: 6px;">
              <div>Current Level: <strong>${sn.currentWaterLevelM} m</strong></div>
              <div>Danger Mark: <strong>${sn.dangerThresholdM} m</strong></div>
              <div>Rainfall: <strong>${sn.currentRainfallMm} mm</strong></div>
              <div style="margin-top: 4px; font-weight: bold; color: ${badgeColor};">Status: ${sn.status}</div>
            </div>
          </div>
        `);
      });
    }

    // 6. Blocked / Caution Roads
    if (layers.roads) {
      roads.forEach((rd) => {
        const isBlocked = rd.status === 'BLOCKED_FLOODED';
        // Place road obstruction markers near primary coordinates
        const marker = L.marker([25.63 + Math.random() * 0.05, 85.12 + Math.random() * 0.05], {
          icon: createCustomIcon(isBlocked ? '#b91c1c' : '#d97706', isBlocked ? '⛔' : '⚠️'),
        }).addTo(mapInstance);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 190px;">
            <div style="font-weight: bold; font-size: 12px; color: #b91c1c;">${rd.roadName}</div>
            <div style="font-size: 11px; color: #64748b;">${rd.segmentDescription}</div>
            <div style="font-size: 11px; margin-top: 4px;">
              <div>Status: <strong>${rd.status.replace(/_/g, ' ')}</strong></div>
              <div>Water Depth: <strong>${rd.waterDepthCm} cm</strong></div>
            </div>
          </div>
        `);
      });
    }

    // 7. SOS Incidents (Admin/Responder)
    if (layers.sos) {
      sosCases.forEach((sos) => {
        if (sos.status === 'RESOLVED') return;
        const marker = L.marker([sos.latitude, sos.longitude], {
          icon: createCustomIcon('#e11d48', '🆘'),
        }).addTo(mapInstance);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px;">
            <div style="font-weight: bold; font-size: 13px; color: #e11d48;">${sos.requestNumber} (${sos.priorityLevel})</div>
            <div style="font-size: 11px; color: #64748b;">${sos.emergencyType.replace(/_/g, ' ')} • ${sos.peopleCount} persons</div>
            <div style="font-size: 11px; margin: 4px 0;">${sos.description}</div>
            <a href="/admin/rescue" style="display: inline-block; background: #e11d48; color: white; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-decoration: none;">Manage Incident</a>
          </div>
        `);
      });
    }
  }, [L, mapInstance, layers, riskZones, shelters, hospitals, reliefCenters, roads, sensors, sosCases]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* Map Container */}
      <div id="aapdasetu-leaflet-container" className="w-full h-full min-h-[500px] z-10" />

      {/* Interactive Layer Toggle Controls (Top-Right Floating Panel) */}
      <div className="absolute top-4 right-4 z-20 bg-navy-950/95 border border-slate-800 backdrop-blur-md rounded-xl p-3 shadow-2xl text-xs text-slate-200 max-w-[220px]">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 mb-2.5 pb-1.5 border-b border-slate-800">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Interactive Map Layers</span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition-colors">
            <input
              type="checkbox"
              checked={layers.riskZones}
              onChange={(e) => setLayers({ ...layers, riskZones: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block shrink-0" />
            <span>Flood Risk Zones</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition-colors">
            <input
              type="checkbox"
              checked={layers.shelters}
              onChange={(e) => setLayers({ ...layers, shelters: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0"
            />
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shrink-0" />
            <span>Evacuation Shelters</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition-colors">
            <input
              type="checkbox"
              checked={layers.hospitals}
              onChange={(e) => setLayers({ ...layers, hospitals: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-red-500 focus:ring-0"
            />
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block shrink-0" />
            <span>Emergency Hospitals</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition-colors">
            <input
              type="checkbox"
              checked={layers.reliefResources}
              onChange={(e) => setLayers({ ...layers, reliefResources: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span>Relief Depots</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition-colors">
            <input
              type="checkbox"
              checked={layers.roads}
              onChange={(e) => setLayers({ ...layers, roads: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shrink-0" />
            <span>Road Obstructions</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition-colors">
            <input
              type="checkbox"
              checked={layers.sensors}
              onChange={(e) => setLayers({ ...layers, sensors: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-purple-500 focus:ring-0"
            />
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block shrink-0" />
            <span>River Gauge Sensors</span>
          </label>

          {showAdminLayers && (
            <label className="flex items-center gap-2 cursor-pointer hover:text-rose-300 transition-colors pt-1 border-t border-slate-800">
              <input
                type="checkbox"
                checked={layers.sos}
                onChange={(e) => setLayers({ ...layers, sos: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
              />
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse inline-block shrink-0" />
              <span className="font-semibold text-rose-300">Live SOS Incidents</span>
            </label>
          )}
        </div>
      </div>

      {/* Map Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-navy-950/90 border border-slate-800 backdrop-blur-md rounded-lg px-3 py-2 text-[11px] text-slate-300 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Extreme</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Low</span>
        </div>
      </div>
    </div>
  );
};

// Export dynamically with SSR disabled
export const MapComponent = dynamic(() => Promise.resolve(LeafletMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium">Loading geospatial emergency map engine...</span>
      </div>
    </div>
  ),
});

export default MapComponent;

