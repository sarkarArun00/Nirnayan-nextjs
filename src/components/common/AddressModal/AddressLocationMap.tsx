"use client";

import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { divIcon, type Marker as LeafletMarker } from "leaflet";

export type MapPosition = {
  latitude: number;
  longitude: number;
};

type AddressLocationMapProps = {
  value: MapPosition | null;
  onChange: (position: MapPosition) => void;
  disabled?: boolean;
};

const locationIcon = divIcon({
  className: "",
  html: `
    <span style="
      display:block;
      width:24px;
      height:24px;
      border:3px solid white;
      border-radius:50%;
      background:#079653;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
    "></span>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function LocationMarker({
  value,
  onChange,
  disabled = false,
}: AddressLocationMapProps) {
  const markerRef = useRef<LeafletMarker | null>(null);

  const map = useMapEvents({
    click(event) {
      if (disabled) return;

      const position = event.latlng.wrap();

      onChange({
        latitude: position.lat,
        longitude: position.lng,
      });
    },
  });

  const latitude = value?.latitude;
  const longitude = value?.longitude;

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;

    map.setView([latitude, longitude], Math.max(map.getZoom(), 16), {
      animate: false,
    });
  }, [map, latitude, longitude]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });

    observer.observe(map.getContainer());
    map.invalidateSize();

    return () => observer.disconnect();
  }, [map]);

  if (!value) return null;

  return (
    <Marker
      ref={markerRef}
      position={[value.latitude, value.longitude]}
      icon={locationIcon}
      draggable={!disabled}
      title="Selected collection location"
      eventHandlers={{
        dragend() {
          if (disabled) return;

          const position = markerRef.current?.getLatLng().wrap();

          if (!position) return;

          onChange({
            latitude: position.lat,
            longitude: position.lng,
          });
        },
      }}
    />
  );
}

export default function AddressLocationMap({
  value,
  onChange,
  disabled = false,
}: AddressLocationMapProps) {
  return (
    <MapContainer
      // Kolkata is only the initial viewport, not a selected address.
      center={value ? [value.latitude, value.longitude] : [22.5726, 88.3639]}
      zoom={value ? 16 : 12}
      scrollWheelZoom={false}
      style={{
        width: "100%",
        height: "280px",
      }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <LocationMarker value={value} onChange={onChange} disabled={disabled} />
    </MapContainer>
  );
}
