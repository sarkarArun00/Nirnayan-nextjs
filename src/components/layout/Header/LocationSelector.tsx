
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./LocationSelector.module.css";

interface HealthcareLocation {
  id: number | string;
  name: string;
}

interface LocationsApiResponse {
  success: boolean;
  data?: HealthcareLocation[];
  message?: string;
}

const LOCATION_COOKIE_NAME = "nhc_location_id";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getSavedLocationId(): string {
  const cookie = document.cookie
    .split("; ")
    .find((item) =>
      item.startsWith(`${LOCATION_COOKIE_NAME}=`)
    );

  if (!cookie) {
    return "";
  }

  return cookie.substring(
    LOCATION_COOKIE_NAME.length + 1
  );
}

export default function LocationSelector() {
  const router = useRouter();

  const [locations, setLocations] = useState<
    HealthcareLocation[]
  >([]);

  const [selectedLocation, setSelectedLocation] =
    useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadLocations() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/locations", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            "Unable to retrieve available locations."
          );
        }

        const result: LocationsApiResponse =
          await response.json();

        if (
          !result.success ||
          !Array.isArray(result.data)
        ) {
          throw new Error(
            "The location API returned an unexpected response."
          );
        }

        if (controller.signal.aborted) {
          return;
        }

        setLocations(result.data);

        const savedLocationId = getSavedLocationId();

        // Restore only a location that exists in
        // the current API response.

        const savedLocationExists = result.data.some(
          (location) =>
            String(location.id) === savedLocationId
        );

        if (savedLocationExists) {
          setSelectedLocation(savedLocationId);
        } else {
          setSelectedLocation("");
        }
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(
          "Unable to load locations:",
          error instanceof Error
            ? error.message
            : "Unknown error"
        );

        setError(
          "Unable to load locations. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadLocations();

    return () => {
      controller.abort();
    };
  }, []);

  function handleLocationChange(locationId: string) {
    const selected = locations.find(
      (location) =>
        String(location.id) === locationId
    );

    if (!selected) {
      setSelectedLocation("");
      return;
    }

    // Store only the selected public location ID.
    // Do not store authentication credentials here.

    document.cookie =
      `${LOCATION_COOKIE_NAME}=${encodeURIComponent(locationId)}; ` +
      `Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax` +
      (window.location.protocol === "https:"
        ? "; Secure"
        : "");

    setSelectedLocation(locationId);

    // Refresh the current route so Server Components
    // can read the newly selected location.

    router.refresh();
  }

  return (
    <div className={styles.locationSelector}>
      <span
        className={styles.locationIcon}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />

          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </span>

      <div className={styles.locationContent}>
        <label
          htmlFor="header-location"
          className={styles.locationLabel}
        >
          Your Location
        </label>

        <select
          id="header-location"
          className={styles.locationSelect}
          value={selectedLocation}
          onChange={(event) =>
            handleLocationChange(event.target.value)
          }
          disabled={isLoading || Boolean(error)}
          required
        >
          <option value="" disabled>
            {isLoading
              ? "Loading locations..."
              : error
                ? "Locations unavailable"
                : "Select your state"}
          </option>

          {locations.map((location) => (
            <option
              key={location.id}
              value={String(location.id)}
            >
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}