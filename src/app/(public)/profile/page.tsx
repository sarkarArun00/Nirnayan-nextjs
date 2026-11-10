"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getLoggedInUser } from "@/actions/session.actions";
import {
  getAllPatients,
  PatientItem,
  GetPatientPayload,
  deletePatient,
} from "@/services/patient.service";
import styles from "./Profile.module.css";
import './page.css';
import AddressModal from "@/components/common/AddressModal/AddressModal";
import {
  deletePatientAddress,
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
  const [addressToDelete, setAddressToDelete] = useState<PatientAddress | null>(
    null,
  );
  const addressDeleteDialogRef = useRef<HTMLDialogElement>(null);
  const addressDeletePendingRef = useRef(false);
  const [deletingAddress, setDeletingAddress] = useState(false);
  const [addressDeleteError, setAddressDeleteError] = useState("");


  const [patientToDelete, setPatientToDelete] = useState<PatientItem | null>(
    null,
  );

  const [deletingPatient, setDeletingPatient] = useState(false);
  const [patientDeleteError, setPatientDeleteError] = useState("");

  const patientDeleteDialogRef = useRef<HTMLDialogElement>(null);
  const patientDeletePendingRef = useRef(false);


  const [editingAddress, setEditingAddress] = useState<
    PatientAddress | undefined
  >(undefined);

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

  // Sticky header Start
  useEffect(() => {
    if (loading || !user) return;
    const profileSection = document.querySelector(".is-profile");
    const header = document.querySelector("header");
    if (!profileSection || !header) {
      console.warn("Sticky header: profile section or header not found.");
      return;
    }
    const handleScroll = () => {
      const headerHeight = header.getBoundingClientRect().height;
      const headerBottom = header.getBoundingClientRect().bottom;
      const profileTop = profileSection.getBoundingClientRect().top;
      // Update sticky bar position for desktop and mobile
      document.documentElement.style.setProperty(
        "--profile-sticky-top",
        `${headerHeight}px`
      );
      // Activate when profile section touches header
      document.body.classList.toggle(
        "active",
        profileTop <= headerBottom
      );
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.body.classList.remove("active");
      document.documentElement.style.removeProperty("--profile-sticky-top");
    };
  }, [loading, user]);
  // Sticky header End

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

  const handleDeleteAddress = async () => {
    if (!addressToDelete || addressDeletePendingRef.current) return;

    const addressId = addressToDelete.id;

    try {
      addressDeletePendingRef.current = true;
      setDeletingAddress(true);
      setAddressDeleteError("");

      await deletePatientAddress(addressId);


      setAddressToDelete(null);
      setAddressRefreshKey((value) => value + 1);
    } catch (error: unknown) {
      setAddressDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete the address. Please try again.",
      );
    } finally {
      addressDeletePendingRef.current = false;
      setDeletingAddress(false);
    }
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
    if (!addressToDelete) return;

    const dialog = addressDeleteDialogRef.current;
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
  }, [addressToDelete]);

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

  useEffect(() => {
    if (!patientToDelete) return;

    const dialog = patientDeleteDialogRef.current;
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
  }, [patientToDelete]);

  const handleDeletePatient = async () => {
    if (!patientToDelete || !user?.id || patientDeletePendingRef.current) {
      return;
    }

    const patientId = patientToDelete.id;

    try {
      patientDeletePendingRef.current = true;
      setDeletingPatient(true);
      setPatientDeleteError("");

      await deletePatient(patientId);

      // Clear the saved default only if it is the deleted patient.
      try {
        const key = `nirnayan_default_patient_${user.id}`;
        const stored = localStorage.getItem(key);
        const saved: unknown = stored ? JSON.parse(stored) : null;

        if (
          typeof saved === "object" &&
          saved !== null &&
          "id" in saved &&
          String(saved.id) === String(patientId)
        ) {
          localStorage.removeItem(key);
          window.dispatchEvent(new Event("defaultPatientUpdated"));
        }
      } catch (error) {
        console.error("Default patient cleanup error:", error);
      }

      setDefaultPatient((current) =>
        String(current?.id) === String(patientId) ? null : current,
      );

      setPatientToDelete(null);

      await loadPatients();

      // Refresh the header using the latest backend cart data.
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error: unknown) {
      setPatientDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete patient. Please try again.",
      );
    } finally {
      patientDeletePendingRef.current = false;
      setDeletingPatient(false);
    }
  };

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
    <section className="profile-page">

      <div className="sticky-bar">
        <div className="container">
          <div className="pro-head">
            <div className="pro-info">
              <div className="img">
                <img src="/assets/images/pkg-img1.png" alt="Profile" />
              </div>
              <div className="text">
                <div className="flex-dv">
                  <h3>Tarun Sana</h3>
                  <span className="pro-badge">Male, 26 yrs</span>
                </div>
                <p>Last Updated 3 days ago</p>
              </div>
            </div>

            <div className="progres">
              <div className="inn">
                <div className="img">
                  <img src="/assets/images/pkg-img1.png" alt="Profile" />
                </div>
                <div className="text">
                  <p>Complete Profile <span>50%</span></p>
                  <div className="progress-track">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul>
            <li><Link href="#">Personal Information</Link></li>
            <li><Link href="#">Saved Patient</Link></li>
            <li><Link href="#">Saved Address</Link></li>
            <li><Link href="#">My Reports</Link></li>
            <li><Link href="#">My Prescription</Link></li>
          </ul>
        </div>
      </div>

      <div className="is-profile">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Profile</li>
            </ol>
          </nav>

          {/* ==== PROFILE DETAILS ==== */}
          <div className="profile-card">
            <div className="row">
              <div className="col-lg-7 col-md-7 col-sm-12">
                <div className="profile-progress">
                  <div className="profile-progress-circle">
                    <svg className="progress-ring" viewBox="0 0 120 120">
                      <circle className="progress-bg" cx="60" cy="60" r="54" />
                      <circle
                        className="progress-fill"
                        cx="60"
                        cy="60"
                        r="54"
                        style={{ "--progress": "12" } as React.CSSProperties}
                      />
                    </svg>

                    <div className="profile-avatar">
                      {/* {user.profile_image ? (
        <img src={user.profile_image} alt="Profile" />
      ) : ( */}
                      <span>{user.first_name?.charAt(0).toUpperCase()}</span>
                      {/* )} */}
                    </div>
                  </div>

                  <div className="profile-percentage">92%</div>
                </div>
                <div className="text-block">
                  <h2>
                    {user.first_name} {user.last_name} <span>Male, 26 yrs </span>
                  </h2>
                  <p>Kolkata, INDIA</p>
                  <p>
                    <i className="fa-regular fa-envelope"></i>
                    {user.email || "No email"}
                  </p>
                  <p>
                    <i className="fa-solid fa-phone"></i>
                    {user.mobile_number || "No mobile number"}
                  </p>
                </div>
              </div>
              <div className="col-lg-5 col-md-5 col-sm-12">
                <div className="questaions">
                  <h3>Still Have Question?</h3>
                  <p>If you need to reach us, please contact us at</p>
                  <Link href="#" className="cmn_btn">Get In Touch</Link>
                </div>
              </div>
            </div>
            <img src="/assets/images/hand.png" alt="" />
          </div>

          {/* ==== PATIENT SECTION ==== */}
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
                      className={`${styles.patientCard} ${isDefault ? styles.defaultCard : ""
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
                        <button
                          type="button"
                          className={styles.editPatientBtn}
                          disabled={deletingPatient}
                          onClick={() => openEditPatientModal(patient)}
                        >
                          <i className="fa-solid fa-pen" aria-hidden="true" />
                          Edit
                        </button>

                        <button
                          type="button"
                          className={styles.deletePatientBtn}
                          disabled={deletingPatient}
                          onClick={() => {
                            setPatientDeleteError("");
                            setPatientToDelete(patient);
                          }}
                        >
                          <i className="fa-solid fa-trash" aria-hidden="true" />
                          Delete
                        </button>

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
                      {/* <button
                          type="button"
                          className={styles.editPatientBtn}
                          onClick={() => openEditPatientModal(patient)}
                        >
                          <i className="fa-solid fa-pen" aria-hidden="true" />
                          Edit
                        </button> */}
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

          {/* ==== ADDRESS SECTION ==== */}
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

                    <div className={styles.savedAddressActions}>
                      <button
                        type="button"
                        className={styles.savedAddressEditBtn}
                        disabled={deletingAddress}
                        onClick={() => {
                          setEditingAddress(address);
                          setShowAddressModal(true);
                        }}
                      >
                        <i className="fa-solid fa-pen" aria-hidden="true" />
                        Edit
                      </button>

                      <button
                        type="button"
                        className={styles.savedAddressDeleteBtn}
                        disabled={deletingAddress}
                        onClick={() => {
                          setAddressDeleteError("");
                          setAddressToDelete(address);
                        }}
                      >
                        <i className="fa-solid fa-trash" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {showAddressModal && (
              <AddressModal
                key={editingAddress?.id ?? "new-address"}
                address={editingAddress}
                onClose={() => {
                  setShowAddressModal(false);
                  setEditingAddress(undefined);
                }}
                onSaved={() => {
                  setShowAddressModal(false);
                  setEditingAddress(undefined);
                  setAddressRefreshKey((value) => value + 1);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {addressToDelete && (
        <dialog
          ref={addressDeleteDialogRef}
          className={styles.addressDeleteDialog}
          aria-labelledby="delete-address-heading"
          aria-describedby="delete-address-description"
          onCancel={(event) => {
            event.preventDefault();

            if (!addressDeletePendingRef.current) {
              setAddressToDelete(null);
            }
          }}
        >
          <h2 id="delete-address-heading">Delete Address?</h2>

          <p id="delete-address-description">
            Remove the <strong>{addressToDelete.addressName}</strong> address
            for <strong>{addressToDelete.fullName}</strong>?
          </p>

          {addressDeleteError && (
            <p className={styles.addressDeleteError} role="alert">
              {addressDeleteError}
            </p>
          )}

          <div className={styles.addressDeleteButtons}>
            <button
              type="button"
              disabled={deletingAddress}
              onClick={() => setAddressToDelete(null)}
              autoFocus
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.confirmAddressDelete}
              disabled={deletingAddress}
              onClick={() => void handleDeleteAddress()}
            >
              {deletingAddress ? "Deleting..." : "Delete"}
            </button>
          </div>
        </dialog>
      )}

      {addressToDelete && (
        <dialog
          ref={addressDeleteDialogRef}
          className={styles.addressDeleteDialog}
          aria-labelledby="delete-address-heading"
          aria-describedby="delete-address-description"
          onCancel={(event) => {
            event.preventDefault();

            if (!addressDeletePendingRef.current) {
              setAddressToDelete(null);
            }
          }}
        >
          <h2 id="delete-address-heading">Delete Address?</h2>

          <p id="delete-address-description">
            Remove the <strong>{addressToDelete.addressName}</strong> address
            for <strong>{addressToDelete.fullName}</strong>?
          </p>

          {addressDeleteError && (
            <p className={styles.addressDeleteError} role="alert">
              {addressDeleteError}
            </p>
          )}

          <div className={styles.addressDeleteButtons}>
            <button
              type="button"
              disabled={deletingAddress}
              onClick={() => setAddressToDelete(null)}
              autoFocus
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.confirmAddressDelete}
              disabled={deletingAddress}
              onClick={() => void handleDeleteAddress()}
            >
              {deletingAddress ? "Deleting..." : "Delete"}
            </button>
          </div>
        </dialog>
      )}

      {patientToDelete && (
        <dialog
          ref={patientDeleteDialogRef}
          className={styles.patientDeleteDialog}
          aria-labelledby="delete-patient-heading"
          aria-describedby="delete-patient-description"
          onCancel={(event) => {
            event.preventDefault();

            if (!patientDeletePendingRef.current) {
              setPatientToDelete(null);
            }
          }}
        >
          <h2 id="delete-patient-heading">Delete Patient?</h2>

          <p id="delete-patient-description">
            Are you sure you want to delete{" "}
            <strong>{patientToDelete.patient_name}</strong> from your saved
            patients?
          </p>

          {patientDeleteError && (
            <p className={styles.patientDeleteError} role="alert">
              {patientDeleteError}
            </p>
          )}

          <div className={styles.patientDeleteActions}>
            <button
              type="button"
              disabled={deletingPatient}
              onClick={() => setPatientToDelete(null)}
              autoFocus
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.confirmPatientDelete}
              disabled={deletingPatient}
              onClick={() => void handleDeletePatient()}
            >
              {deletingPatient ? "Deleting..." : "Delete Patient"}
            </button>
          </div>
        </dialog>
      )}

    </section>
  );
}
