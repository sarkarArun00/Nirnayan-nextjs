"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  addPatientAddress,
  editPatientAddress,
  type PatientAddress,
  type PatientAddressPayload,
} from "@/services/cart.service";
import styles from "./AddressModal.module.css";
import dynamic from "next/dynamic";
import type { MapPosition } from "./AddressLocationMap";



type AddressModalProps = {
  address?: PatientAddress;
  onClose: () => void;
  onSaved: () => void;
};

type AddressForm = {
  addressName: string;
  fullName: string;
  contactNumber: string;
  alt_contactNumber: string;
  pinCode: string;
  addressLine_1: string;
  addressLine_2: string;
  landMark: string;
  latitude: string;
  longitude: string;
};

type AddressField = {
  name: keyof AddressForm;
  label: string;
  type?: "text" | "tel" | "number";
  required?: boolean;
  wide?: boolean;
  min?: number;
  max?: number;
  step?: string;
};

const addressFields: AddressField[] = [
  {
    name: "fullName",
    label: "Full Name",
    required: true,
  },
  {
    name: "contactNumber",
    label: "Contact Number",
    type: "tel",
    required: true,
  },
  {
    name: "alt_contactNumber",
    label: "Alternate Contact Number",
    type: "tel",
  },
  {
    name: "pinCode",
    label: "PIN Code",
    type: "number",
    required: true,
    min: 1,
    step: "1",
  },
  {
    name: "landMark",
    label: "Landmark",
  },
  {
    name: "addressLine_1",
    label: "Address Line 1",
    required: true,
    wide: true,
  },
  {
    name: "addressLine_2",
    label: "Address Line 2",
    wide: true,
  },
  {
    name: "latitude",
    label: "Latitude",
    type: "number",
    required: true,
    min: -90,
    max: 90,
    step: "any",
  },
  {
    name: "longitude",
    label: "Longitude",
    type: "number",
    required: true,
    min: -180,
    max: 180,
    step: "any",
  },
];

const AddressLocationMap = dynamic(() => import("./AddressLocationMap"), {
  ssr: false,
  loading: () => <p role="status">Loading map...</p>,
});

export default function AddressModal({
  address,
  onClose,
  onSaved,
}: AddressModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submittingRef = useRef(false);

  const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState("");

    const locationRequestRef = useRef(0);

  const [form, setForm] = useState<AddressForm>(() => ({
    addressName: address?.addressName ?? "",
    fullName: address?.fullName ?? "",
    contactNumber: address?.contactNumber ?? "",
    alt_contactNumber: address?.alt_contactNumber ?? "",
    pinCode: address ? String(address.pinCode) : "",
    addressLine_1: address?.addressLine_1 ?? "",
    addressLine_2: address?.addressLine_2 ?? "",
    landMark: address?.landMark ?? "",
    latitude: address ? String(address.latitude) : "",
    longitude: address ? String(address.longitude) : "",
  }));

    useEffect(() => {
      return () => {
        locationRequestRef.current += 1;
      };
    }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;

      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submittingRef.current || locating) return;

    setError("");

    const pinCode = Number(form.pinCode);
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!form.pinCode.trim() || !Number.isInteger(pinCode) || pinCode <= 0) {
      setError("Please enter a valid PIN code.");
      return;
    }

    if (
      !form.latitude.trim() ||
      !form.longitude.trim() ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError("Please enter valid latitude and longitude.");
      return;
    }

    const payload: Omit<PatientAddressPayload, "alt_contactNumber"> = {
      addressName: form.addressName.trim(),
      fullName: form.fullName.trim(),
      contactNumber: form.contactNumber.trim(),
      pinCode,
      addressLine_1: form.addressLine_1.trim(),
      addressLine_2: form.addressLine_2.trim(),
      landMark: form.landMark.trim(),
      latitude,
      longitude,
      status: address?.status ?? true,
    };

    if (
      !payload.addressName ||
      !payload.fullName ||
      !payload.contactNumber ||
      !payload.addressLine_1
    ) {
      setError("Please complete the required fields.");
      return;
    }

    try {
      submittingRef.current = true;
      setSaving(true);

      if (address) {
        await editPatientAddress({
          ...payload,
          address_id: address.id,
        });
      } else {
        await addPatientAddress({
          ...payload,
          alt_contactNumber: form.alt_contactNumber.trim(),
        });
      }

      onSaved();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save the address. Please try again.",
      );
    } finally {
      submittingRef.current = false;
      setSaving(false);
    }
  };

    const handleMapPositionChange = (position: MapPosition) => {
      if (submittingRef.current) return;

      // Ignore a pending GPS result if the user selects the map instead.
      locationRequestRef.current += 1;
      setLocating(false);
      setLocationError("");

      setForm((current) => ({
        ...current,
        latitude: position.latitude.toFixed(6),
        longitude: position.longitude.toFixed(6),
      }));
    };

    const handleUseCurrentLocation = () => {
      if (saving || locating) return;

      setLocationError("");

      if (!window.isSecureContext) {
        setLocationError("Current location requires HTTPS or localhost.");
        return;
      }

      if (!navigator.geolocation) {
        setLocationError(
          "Your browser does not support location access. Select your location on the map.",
        );
        return;
      }

      const requestId = ++locationRequestRef.current;

      setLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (requestId !== locationRequestRef.current) return;

          setForm((current) => ({
            ...current,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));

          setLocating(false);
        },
        (locationError) => {
          if (requestId !== locationRequestRef.current) return;

          setLocating(false);

          switch (locationError.code) {
            case 1:
              setLocationError(
                "Location access was denied. Allow location access in your browser or select a location on the map.",
              );
              break;

            case 2:
              setLocationError(
                "Your location could not be determined. Select a location on the map.",
              );
              break;

            case 3:
              setLocationError(
                "Location request timed out. Try again or select a location on the map.",
              );
              break;

            default:
              setLocationError(
                "Unable to get your location. Select a location on the map.",
              );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    };

    const selectedMapPosition: MapPosition | null =
      form.latitude.trim() !== "" && form.longitude.trim() !== ""
        ? {
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
          }
        : null;
  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="address-modal-title"
      onCancel={(event) => {
        event.preventDefault();

        if (!submittingRef.current) {
          onClose();
        }
      }}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <div>
            <h2 id="address-modal-title">
              {address ? "Edit Address" : "Add Address"}
            </h2>

            <p>Enter your sample collection address.</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close address modal"
            disabled={saving}
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>
          <fieldset className={styles.fields} disabled={saving}>
            <div className={styles.fullWidth}>
              <div id="address-name-label" className={styles.fieldLabel}>
                Address Name <span aria-hidden="true">*</span>
              </div>

              <div
                className={styles.addressTypeOptions}
                role="radiogroup"
                aria-labelledby="address-name-label"
              >
                {(["Home", "Office", "Work", "Other"] as const).map((name) => (
                  <label
                    key={name}
                    className={`${styles.addressTypeChoice} ${
                      form.addressName === name
                        ? styles.selectedAddressType
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="addressName"
                      value={name}
                      checked={form.addressName === name}
                      required
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          addressName: name,
                        }))
                      }
                    />

                    <span>{name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.fullWidth}>
              <div className={styles.locationToolbar}>
                <div className={styles.fieldLabel}>
                  Collection Location <span aria-hidden="true">*</span>
                </div>

                <button
                  type="button"
                  className={styles.currentLocationButton}
                  disabled={saving || locating}
                  onClick={handleUseCurrentLocation}
                >
                  <i
                    className={
                      locating
                        ? "fa-solid fa-spinner fa-spin"
                        : "fa-solid fa-location-crosshairs"
                    }
                    aria-hidden="true"
                  />

                  {locating ? "Getting Location..." : "Use My Current Location"}
                </button>
              </div>

              <div className={styles.mapWrapper}>
                <AddressLocationMap
                  value={selectedMapPosition}
                  onChange={handleMapPositionChange}
                  disabled={saving}
                />
              </div>

              <p className={styles.mapHint}>
                Click the map or drag the marker to select your collection
                location.
              </p>

              {locating && (
                <p className={styles.mapHint} role="status">
                  Finding your current location...
                </p>
              )}

              {locationError && (
                <p className={styles.locationError} role="alert">
                  {locationError}
                </p>
              )}
            </div>

            {addressFields
              .filter((field) => !address || field.name !== "alt_contactNumber")
              .map((field) => (
                <div
                  key={field.name}
                  className={field.wide ? styles.fullWidth : undefined}
                >
                  <label htmlFor={`address-${field.name}`}>
                    {field.label}
                    {field.required && <span aria-hidden="true"> *</span>}
                  </label>

                  <input
                    id={`address-${field.name}`}
                    name={field.name}
                    type={field.type ?? "text"}
                    value={form[field.name]}
                    readOnly={
                      field.name === "latitude" || field.name === "longitude"
                    }
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    onChange={(event) => {
                      const value = event.target.value;

                      setForm((current) => ({
                        ...current,
                        [field.name]: value,
                      }));
                    }}
                  />
                </div>
              ))}
          </fieldset>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving || locating}
          >
            {saving ? "Saving..." : address ? "Update Address" : "Save Address"}
          </button>
          {/* <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? "Saving..." : address ? "Update Address" : "Save Address"}
          </button> */}
        </div>
      </form>
    </dialog>
  );
}
