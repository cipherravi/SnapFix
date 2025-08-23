// components/MapDisplay.tsx
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapDisplayProps {
  location: [number, number]; // [lat, lng]
  zoom?: number;
}

export default function MapDisplay({ location, zoom = 13 }: MapDisplayProps) {
  return (
    <div className="w-full h-52 rounded-xl overflow-hidden">
      <MapContainer
        center={location as LatLngExpression}
        zoom={zoom}
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
        <Marker position={location} />
      </MapContainer>
    </div>
  );
}
