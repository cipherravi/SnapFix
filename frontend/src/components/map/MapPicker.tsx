import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
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
      map.setView(location, zoom);
    }
  }, [location[0], location[1], zoom]);

  return null;
}

interface MapPickerProps {
  location: [number, number]; // initial [lat, lng]
  onLocationSelect: (pos: [number, number]) => void;
  zoom?: number;
  type?: "create" | "edit";
  editable?: boolean;
  animateOnLoad?: boolean;
}

export default function MapPicker({
  onLocationSelect,
  location,
  zoom = 3,
  type = "create",
  editable = true,
  animateOnLoad = false,
}: MapPickerProps) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <MapContainer
        center={location}
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

        {/* Show ONE marker at current location always */}
        {type == "edit" && <Marker position={location} />}

        {/* Only allow new pin when editable */}
        {editable && <LocationMarker onChange={onLocationSelect} />}

        {type == "create" && (
          <SetViewOnChange
            location={location}
            zoom={zoom}
            animateOnLoad={animateOnLoad}
          />
        )}
      </MapContainer>
    </div>
  );
}
