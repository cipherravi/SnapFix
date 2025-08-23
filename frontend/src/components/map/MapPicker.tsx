// components/MapPicker.tsx
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix default icon loading issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Optional custom icon (comment if using default above)
// const customIcon = new L.Icon({
//   iconUrl: "/svg/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

interface LocationMarkerProps {
  onChange: (pos: [number, number]) => void;
}

function LocationMarker({ onChange }: LocationMarkerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e: LeafletMouseEvent) {
      const latlng: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(latlng);
      onChange(latlng);
    },
  });

  return position ? (
    <Marker position={position as LatLngExpression} /> //icon={customIcon}
  ) : null;
}

interface MapPickerProps {
  location?: [number, number]; // initial [lat, lng]
  onLocationSelect: (pos: [number, number]) => void;
}

export default function MapPicker({
  onLocationSelect,
  location,
}: MapPickerProps) {
  return (
    <div className="w-full h-52 rounded-xl overflow-hidden">
      <MapContainer
        center={
          location ||
          ([25.545229354169017, 84.65927124023439] as LatLngExpression)
        }
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker onChange={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
