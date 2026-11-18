"use client";

import { useEffect, useRef } from "react";

import "leaflet/dist/leaflet.css";

type PhleboTrackingMapProps = {
  phleboLat: number;
  phleboLng: number;

  bookingLat: number;
  bookingLng: number;
};

type OsrmRouteResponse = {
  code: string;

  routes?: Array<{
    distance: number;
    duration: number;

    geometry: {
      type: "LineString";

      // OSRM returns [longitude, latitude]
      coordinates: [number, number][];
    };
  }>;
};

export default function PhleboTrackingMap({
  phleboLat,
  phleboLng,
  bookingLat,
  bookingLng,
}: PhleboTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    let cancelled = false;

    let map: import("leaflet").Map | null = null;

    const initMap = async () => {
      const L = await import("leaflet");

      if (cancelled || !mapRef.current) {
        return;
      }

      const container = mapRef.current as HTMLDivElement & {
        _leaflet_id?: number;
      };

      if (container._leaflet_id) {
        return;
      }

      const origin: [number, number] = [phleboLat, phleboLng];

      const destination: [number, number] = [bookingLat, bookingLng];

      /* =========================
         CREATE MAP
         ========================= */

      map = L.map(mapRef.current, {
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,

        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      /* =========================
         BOOKING ADDRESS MARKER
         ========================= */

      const homeIcon = L.divIcon({
        className: "booking-home-leaflet-icon",

        html: `
            <div class="booking-home-marker">
              <i class="fa-solid fa-house"></i>
            </div>
          `,

        iconSize: [46, 46],

        iconAnchor: [23, 23],
      });

      L.marker(destination, {
        icon: homeIcon,

        zIndexOffset: 2000,
      })
        .addTo(map)
        .bindTooltip("Booking Address", {
          direction: "top",
        });

      /* =========================
         PHLEBOTOMIST BIKE MARKER
         ========================= */

      const bikeIcon = L.divIcon({
        className: "phlebo-bike-leaflet-icon",

        html: `
            <div class="phlebo-bike-marker">

              <div class="phlebo-bike-icon">
                <span class="phlebo-bike-emoji">
                  🛵
                </span>
              </div>

              <div class="phlebo-bike-label">
                Phlebo
              </div>

            </div>
          `,

        iconSize: [70, 70],

        iconAnchor: [35, 35],
      });

      L.marker(origin, {
        icon: bikeIcon,

        zIndexOffset: 5000,
      })
        .addTo(map)
        .bindTooltip("Phlebotomist", {
          direction: "top",
        });

      /* =========================
         GET ACTUAL ROAD ROUTE
         ========================= */

      try {
        const routeUrl =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${phleboLng},${phleboLat};` +
          `${bookingLng},${bookingLat}` +
          `?overview=full` +
          `&geometries=geojson` +
          `&steps=false`;

        const response = await fetch(routeUrl);

        if (!response.ok) {
          throw new Error(`Route API returned ${response.status}`);
        }

        const result: OsrmRouteResponse = await response.json();

        if (
          result.code !== "Ok" ||
          !result.routes?.length ||
          !result.routes[0].geometry.coordinates.length
        ) {
          throw new Error("No driving route found.");
        }

        /*
         * OSRM:
         * [lng, lat]
         *
         * Leaflet:
         * [lat, lng]
         */
        const routePoints: [number, number][] =
          result.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        /* ROUTE SHADOW */

        L.polyline(routePoints, {
          color: "#b8ddc6",

          weight: 8,

          opacity: 0.65,

          lineCap: "round",

          lineJoin: "round",
        }).addTo(map);

        /* MAIN ROUTE */

        L.polyline(routePoints, {
          color: "#00A651",

          weight: 5,

          opacity: 1,

          lineCap: "round",

          lineJoin: "round",
        }).addTo(map);

        /* FIT ROAD ROUTE */

        const bounds = L.latLngBounds(
          routePoints.map(([lat, lng]) => L.latLng(lat, lng)),
        );

        map.fitBounds(bounds, {
          padding: [55, 55],
        });
      } catch (error) {
        console.error("Unable to load road route:", error);

        /*
         * If OSRM fails,
         * show the two locations only.
         */
        map.fitBounds([origin, destination], {
          padding: [65, 65],
        });
      }

      /*
       * Modal rendering fix.
       */
      setTimeout(() => {
        map?.invalidateSize();
      }, 150);
    };

    void initMap();

    return () => {
      cancelled = true;

      if (map) {
        map.remove();
      }
    };
  }, [phleboLat, phleboLng, bookingLat, bookingLng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "450px",
      }}
    />
  );
}
