import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

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

interface SetViewOnChangeProps {
  location: [number, number];
  zoom: number;
  animateOnLoad?: boolean;
}
// 🧠 This will update the map's view when props change
function SetViewOnChange({
  location,
  zoom,
  animateOnLoad = false,
}: SetViewOnChangeProps) {
  const map = useMap();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (animateOnLoad && !hasAnimated) {
      map.setView(location, 3); // Start at low zoom
      setTimeout(() => {
        map.flyTo(location, zoom, { duration: 1.5 });
        setHasAnimated(true);
      }, 200); // short delay
    } else {
      map.setView(location, zoom); // Just update without animation
    }
  }, [location[0], location[1], zoom]);

  return null;
}

interface MapDisplayProps {
  location: [number, number]; // [lat, lng]
  zoom?: number;
  animateOnLoad?: boolean;
}

export default function MapDisplay({
  location,
  zoom = 13,
  animateOnLoad = false,
}: MapDisplayProps) {
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
        <SetViewOnChange
          location={location}
          zoom={zoom}
          animateOnLoad={animateOnLoad}
        />
      </MapContainer>
    </div>
  );
}
