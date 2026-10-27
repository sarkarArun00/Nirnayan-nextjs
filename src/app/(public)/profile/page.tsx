"use client";

import { useCallback,useEffect, useState } from "react";

import Link from "next/link";

import { getLoggedInUser } from "@/actions/session.actions";

import {
  getAllPatients,
  PatientItem,
  GetPatientPayload,
} from "@/services/patient.service";

import styles from "./Profile.module.css";

import AddressModal from "@/components/common/AddressModal/AddressModal";
import {
  getAllPatientAddresses,
  type PatientAddress,
} from "@/services/cart.service";
import { usePatientSelection } from "@/components/common/PatientSelectionModal/PatientSelectionProvider";

type LoginUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
};

type DefaultPatient = {
  id: number | string;
  name: string;
  gender: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  isNew: boolean;
};

export default function ProfilePage() {
  const [user, setUser] = useState<LoginUser | null>(null);

  const [patients, setPatients] = useState<PatientItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [patientLoading, setPatientLoading] = useState(true);

  const [defaultPatient, setDefaultPatient] = useState<DefaultPatient | null>(
    null,
  );
  const { openAddPatientModal, openEditPatientModal } = usePatientSelection();

  const [addresses, setAddresses] = useState<PatientAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressRefreshKey, setAddressRefreshKey] = useState(0);


  
  const loadPatients = useCallback(async () => {
      try {
        setPatientLoading(true);

        /*
        * IMPORTANT:
        * Use the SAME payload that you are
        * currently passing in your patient modal.
        */
        const user = await getLoggedInUser();
            if (!user?.id) {
              throw new Error("User not logged in.");
            }

          const userId = Number(user.id);
        const payload: GetPatientPayload = {
          user_id: userId,
        };

        const response = await getAllPatients(payload);

        if (response?.data && Array.isArray(response.data)) {
          setPatients(response.data);
        } else {
          setPatients([]);
        }
      } catch (error) {
        console.error("Patient list error:", error);

        setPatients([]);
      } finally {
        setPatientLoading(false);
      }
    }, []);

  const loadDefaultPatient = useCallback((userId: number) => {
    try {
      const key = `nirnayan_default_patient_${userId}`;

      const saved = localStorage.getItem(key);

      if (!saved) {
        setDefaultPatient(null);
        return;
      }

      const patient = JSON.parse(saved) as DefaultPatient;

      setDefaultPatient(patient);
    } catch (error) {
      console.error("Default patient load error:", error);

      setDefaultPatient(null);
    }
  }, []);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const getGenderName = (gender: number) => {
    if (gender === 1) {
      return "Male";
    }

    if (gender === 2) {
      return "Female";
    }

    if (gender === 3) {
      return "Other";
    }

    return "Other";
  };

  const handleSetDefaultPatient = (patient: PatientItem) => {
    if (!user?.id) {
      return;
    }

    const patientData: DefaultPatient = {
      id: patient.id,

      name: patient.patient_name,

      gender: getGenderName(patient.gender),

      age: patient.dob ? calculateAge(patient.dob) : undefined,

      dob: patient.dob || undefined,

      bloodGroup:
        patient.blood_group !== null && patient.blood_group !== undefined
          ? String(patient.blood_group)
          : undefined,

      isNew: false,
    };

    const key = `nirnayan_default_patient_${user.id}`;

    localStorage.setItem(key, JSON.stringify(patientData));

    setDefaultPatient(patientData);

    window.dispatchEvent(new Event("defaultPatientUpdated"));
  };

  const handleRemoveDefaultPatient = () => {
    if (!user?.id) {
      return;
    }

    const key = `nirnayan_default_patient_${user.id}`;

    localStorage.removeItem(key);

    setDefaultPatient(null);

    window.dispatchEvent(new Event("defaultPatientUpdated"));
  };

  useEffect(() => {
    let cancelled = false;

    const loadAddresses = async () => {
      try {
        setLoadingAddresses(true);
        setAddressError("");

        const response = await getAllPatientAddresses();

        if (cancelled) return;

        setAddresses(
          response.data.filter(
            (address) =>
              address.status === true && address.delete_status !== true,
          ),
        );
      } catch (error: unknown) {
        if (cancelled) return;

        setAddresses([]);
        setAddressError(
          error instanceof Error
            ? error.message
            : "Unable to load saved addresses.",
        );
      } finally {
        if (!cancelled) {
          setLoadingAddresses(false);
        }
      }
    };

    void loadAddresses();

    return () => {
      cancelled = true;
    };
  }, [addressRefreshKey]);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const loggedUser = await getLoggedInUser();

        if (!loggedUser) {
          setUser(null);
          return;
        }

        setUser(loggedUser);

        loadDefaultPatient(loggedUser.id);

        await loadPatients();
      } catch (error) {
        console.error("Profile initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    void initializeProfile();
  }, [loadPatients, loadDefaultPatient]);

  useEffect(() => {
    const handlePatientsUpdated = () => {
      void loadPatients();

      if (user?.id) {
        loadDefaultPatient(user.id);
      }
    };

    window.addEventListener("patientsUpdated", handlePatientsUpdated);

    return () => {
      window.removeEventListener("patientsUpdated", handlePatientsUpdated);
    };
  }, [loadPatients, loadDefaultPatient, user?.id]);
  
  if (loading) {
    return (
      <section className={styles.profilePage}>
        <div className="container">Loading profile...</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className={styles.profilePage}>
        <div className="container">
          <div className={styles.emptyState}>
            <h3>Please sign in</h3>

            <p>Sign in to view your profile.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.profilePage}>
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>

          <span>/</span>

          <strong>My Profile</strong>
        </div>

        <div className={styles.pageHeader}>
          <div>
            <h1>My Profile</h1>

            <p>
              Manage your personal information, patients and saved addresses.
            </p>
          </div>
        </div>

        {/* =====================
            PROFILE DETAILS
        ====================== */}

        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            {user.first_name?.charAt(0).toUpperCase()}
          </div>

          <div className={styles.profileInfo}>
            <h2>
              {user.first_name} {user.last_name}
            </h2>

            <div className={styles.profileMeta}>
              <span>
                <i className="fa-regular fa-envelope"></i>

                {user.email || "No email"}
              </span>

              <span>
                <i className="fa-solid fa-phone"></i>

                {user.mobile_number || "No mobile number"}
              </span>
            </div>
          </div>
        </div>

        {/* =====================
            PATIENT SECTION
        ====================== */}

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Patients</h3>

              <p>Manage patients and choose your default patient.</p>
            </div>

            <button
              type="button"
              className={styles.addAddressBtn}
              onClick={openAddPatientModal}
            >
              + Add Patient
            </button>
          </div>

          {defaultPatient && (
            <div className={styles.defaultInfo}>
              <div>
                <span className={styles.defaultIcon}>✓</span>

                <div>
                  <strong>Default Patient</strong>

                  <p>
                    {defaultPatient.name} will be selected automatically while
                    adding tests or packages.
                  </p>
                </div>
              </div>

              <button type="button" onClick={handleRemoveDefaultPatient}>
                Remove Default
              </button>
            </div>
          )}

          {patientLoading ? (
            <div className={styles.loadingBox}>Loading patients...</div>
          ) : patients.length > 0 ? (
            <div className={styles.patientList}>
              {patients.map((patient) => {
                const isDefault =
                  String(defaultPatient?.id) === String(patient.id);

                return (
                  <div
                    key={patient.id}
                    className={`${styles.patientCard} ${
                      isDefault ? styles.defaultCard : ""
                    }`}
                  >
                    <div className={styles.patientLeft}>
                      <div className={styles.patientAvatar}>
                        {patient.patient_name?.charAt(0).toUpperCase()}
                      </div>

                      <div className={styles.patientDetails}>
                        <div className={styles.patientName}>
                          <h4>{patient.patient_name}</h4>

                          {isDefault && <span>Default</span>}
                        </div>

                        <p>
                          {getGenderName(patient.gender)}

                          {patient.dob &&
                            ` · ${calculateAge(patient.dob)} Years`}
                        </p>

                        {patient.phoneNumber && (
                          <small>{patient.phoneNumber}</small>
                        )}
                      </div>
                    </div>

                    <div className={styles.patientActions}>
                      {isDefault ? (
                        <button
                          type="button"
                          className={styles.removeDefaultBtn}
                          onClick={handleRemoveDefaultPatient}
                        >
                          Remove Default
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={styles.defaultBtn}
                          onClick={() => handleSetDefaultPatient(patient)}
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      className={styles.editPatientBtn}
                      onClick={() => openEditPatientModal(patient)}
                    >
                      <i className="fa-solid fa-pen" aria-hidden="true" />
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h4>No patients found</h4>

              <p>Your registered patients will appear here.</p>
            </div>
          )}
        </div>

        {/* =====================
            ADDRESS SECTION
        ====================== */}

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Saved Addresses</h3>
              <p>Manage addresses for home sample collection.</p>
            </div>

            <button
              type="button"
              className={styles.addAddressBtn}
              onClick={() => setShowAddressModal(true)}
            >
              + Add Address
            </button>
          </div>

          {loadingAddresses ? (
            <div className={styles.emptyState} role="status">
              <p>Loading saved addresses...</p>
            </div>
          ) : addressError ? (
            <div className={styles.emptyState}>
              <p role="alert">{addressError}</p>

              <button
                type="button"
                className={styles.addAddressBtn}
                onClick={() => setAddressRefreshKey((value) => value + 1)}
              >
                Try Again
              </button>
            </div>
          ) : addresses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.addressIcon}>
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
              </div>

              <h4>No saved addresses</h4>
              <p>Your saved collection addresses will appear here.</p>
            </div>
          ) : (
            <div className={styles.savedAddressGrid}>
              {addresses.map((address) => (
                <article key={address.id} className={styles.savedAddressCard}>
                  <div className={styles.savedAddressHeader}>
                    <h4>{address.fullName}</h4>

                    <span className={styles.savedAddressType}>
                      {address.addressName}
                    </span>
                  </div>

                  <p className={styles.savedAddressText}>
                    {[
                      address.addressLine_1,
                      address.addressLine_2,
                      address.landMark,
                      address.pinCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <a
                    href={`tel:${address.contactNumber}`}
                    className={styles.savedAddressPhone}
                  >
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                    {address.contactNumber}
                  </a>
                </article>
              ))}
            </div>
          )}

          {showAddressModal && (
            <AddressModal
              onClose={() => setShowAddressModal(false)}
              onSaved={() => {
                setShowAddressModal(false);
                setAddressRefreshKey((value) => value + 1);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
