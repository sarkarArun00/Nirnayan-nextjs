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

const reportPatients = [
  { id: 1, name: "Tarun Sana", count: 2 },
  { id: 2, name: "Ambar Ghosh", count: 1 },
  { id: 3, name: "Sayanta Dutta", count: 2 },
];

type ReportInvestigation = {
  id: number;
  name: string;
  gender: string;
  age: number;
  investigationId: string;
  date: string;
  time: string;
  tests: string[];
  more: string;
};

const investigations: Record<number, ReportInvestigation[]> = {
  1: [
    {
      id: 101,
      name: "Tarun Sana",
      gender: "Male",
      age: 26,
      investigationId: "INV-0000",
      date: "24 Oct 2026",
      time: "4:15 PM",
      tests: ["Hemoglobin (Hb)", "Liver Function Tests (LFT)"],
      more: "6+ More",
    },
    {
      id: 102,
      name: "Tarun Sana",
      gender: "Male",
      age: 26,
      investigationId: "INV-0000",
      date: "24 Oct 2026",
      time: "4:15 PM",
      tests: ["Hemoglobin (Hb)", "Liver Function Tests (LFT)"],
      more: "6+ More",
    },
  ],
  2: [
    {
      id: 201,
      name: "Ambar Ghosh",
      gender: "Male",
      age: 32,
      investigationId: "INV-0001",
      date: "23 Oct 2026",
      time: "2:30 PM",
      tests: ["Complete Blood Count", "Thyroid Profile"],
      more: "3+ More",
    },
  ],
  3: [
    {
      id: 301,
      name: "Sayanta Dutta",
      gender: "Male",
      age: 28,
      investigationId: "INV-0002",
      date: "22 Oct 2026",
      time: "11:45 AM",
      tests: ["Hemoglobin (Hb)", "Liver Function Tests (LFT)"],
      more: "6+ More",
    },
    {
      id: 302,
      name: "Sayanta Dutta",
      gender: "Male",
      age: 28,
      investigationId: "INV-0003",
      date: "20 Oct 2026",
      time: "10:15 AM",
      tests: ["Blood Sugar", "Kidney Function Test"],
      more: "4+ More",
    },
  ],
};

const sectionIds = ["information", "patient", "address", "report"];

export default function ProfilePage() {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);
  const [defaultPatient, setDefaultPatient] = useState<DefaultPatient | null>(null,);
  const { openAddPatientModal, openEditPatientModal } = usePatientSelection();
  const [expandedAddressId, setExpandedAddressId] = useState<string | number | null>(null);
  const [activePatient, setActivePatient] = useState(1);
  const handleView = (item: ReportInvestigation) => {
    alert(`Investigation ID: ${item.investigationId}`);
  };
  const [addresses, setAddresses] = useState<PatientAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressRefreshKey, setAddressRefreshKey] = useState(0);
  const [addressToDelete, setAddressToDelete] = useState<PatientAddress | null>(null,);
  const addressDeleteDialogRef = useRef<HTMLDialogElement>(null);
  const addressDeletePendingRef = useRef(false);
  const [deletingAddress, setDeletingAddress] = useState(false);
  const [addressDeleteError, setAddressDeleteError] = useState("");
  const [patientToDelete, setPatientToDelete] = useState<PatientItem | null>(null,);
  const [deletingPatient, setDeletingPatient] = useState(false);
  const [patientDeleteError, setPatientDeleteError] = useState("");
  const patientDeleteDialogRef = useRef<HTMLDialogElement>(null);
  const patientDeletePendingRef = useRef(false);
  const [expandedPatientId, setExpandedPatientId] = useState<string | number | null>(null);
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

  // for ul li click thing Start
  const [activeSection, setActiveSection] = useState("information");
  const stickyBarRef = useRef<HTMLDivElement>(null);

  const handleStickyNavigation = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const offset = stickyBarRef.current?.getBoundingClientRect().bottom ?? 0;
    setActiveSection(id);
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top - offset - 10,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = (stickyBarRef.current?.getBoundingClientRect().bottom ?? 0) + 10;
      const current = [...sectionIds].reverse().find((id) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= offset;
      });

      if (current) setActiveSection(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // for ul li click thing End

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


      <div className="sticky-bar" ref={stickyBarRef}>
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
            <li className={activeSection === "information" ? "active" : ""}>
              <button type="button" onClick={() => handleStickyNavigation("information")}>
                Personal Information
              </button>
            </li>

            <li className={activeSection === "patient" ? "active" : ""}>
              <button type="button" onClick={() => handleStickyNavigation("patient")}>
                Saved Patient
              </button>
            </li>

            <li className={activeSection === "address" ? "active" : ""}>
              <button type="button" onClick={() => handleStickyNavigation("address")}>
                Saved Address
              </button>
            </li>

            <li className={activeSection === "report" ? "active" : ""}>
              <button type="button" onClick={() => handleStickyNavigation("report")}>
                My Reports
              </button>
            </li>
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
                <div className="d-flex align-items-center">
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
                      <img src="/assets/images/verified.svg" alt="" />
                    </p>
                    <p>
                      <i className="fa-solid fa-phone"></i>
                      {user.mobile_number || "No mobile number"}
                      <img src="/assets/images/verified.svg" alt="" />
                    </p>
                  </div>
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
            <img className="hand-img" src="/assets/images/hand.png" alt="" />
          </div>

          {/* ==== PERSONAL INFORMATION ==== */}
          <div className="info-box" id="information">
            <div className="title">
              <div className="left">
                <img src="/assets/images/profile-icon1.svg" alt="" />
                <h4>Personal Information</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="inp-box">
                  <label>First Name<span>*</span></label>
                  <input type="text" placeholder="Your Name" className="form-control" />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="inp-box">
                  <label>Last Name<span>*</span></label>
                  <input type="text" placeholder="Your Last Name" className="form-control" />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="inp-box">
                  <label>DOB<span>*</span></label>
                  <input type="date" placeholder="" className="form-control" />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="inp-box">
                  <label>Alternate Email (Optional)</label>
                  <input type="text" placeholder="Your Email" className="form-control" />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inf-box-footer d-flex align-items-center justify-content-between">
                  <label className="subscription-item">
                    <input type="checkbox" className="subscription-checkbox" defaultChecked />
                    <div className="subscription-content">
                      <h6>Email Subscription</h6>
                      <p>Receive digital test reports, invoices, and health insights directly to banni@yopmail.com</p>
                    </div>
                  </label>
                  <div className="btn-block d-flex gap-2">
                    <button className="sec_btn border-0">Discard</button>
                    <button className="cmn_btn">Update</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ==== PATIENT SECTION ==== */}
          <div className="info-box" id="patient">
            <div className="title">
              <div className="left">
                <img src="/assets/images/profile-icon2.svg" alt="" />
                <h4>Saved Patient</h4>
              </div>

              <button
                type="button"
                className="exp-btn"
                onClick={openAddPatientModal}
              >
                Add Patient <img src="/assets/images/profile-icon3.svg" alt="" />
              </button>
            </div>

            {defaultPatient && (
              <div className="default-info">
                <div className="left">
                  <div className="icon">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className="text-block">
                    <h6>Default Patient</h6>
                    <p><strong>{defaultPatient.name}</strong> will be selected automatically while adding tests or packages.</p>
                  </div>
                </div>

                <button type="button" onClick={handleRemoveDefaultPatient}>
                  Remove Default
                </button>
              </div>
            )}

            {patientLoading ? (
              <div className="loadingBox">Loading patients...</div>
            ) : patients.length > 0 ? (
              <div className="patient-list">
                {patients.map((patient) => {
                  const isDefault =
                    String(defaultPatient?.id) === String(patient.id);

                  return (
                    <div
                      key={patient.id}
                      className={`patient-card ${isDefault ? "active" : ""}`}
                    >
                      <div className="patient-left">
                        <div className="icon">
                          <h3>{patient.patient_name?.charAt(0).toUpperCase()}</h3>
                        </div>
                        <div className="patient-dtl">
                          <h4>{patient.patient_name}</h4>
                          {/* {isDefault && <span>Default</span>} */}

                          <p className="patient-gender">
                            <i
                              className={`fa-solid ${patient.gender === 1
                                ? "fa-mars"
                                : patient.gender === 2
                                  ? "fa-venus"
                                  : "fa-genderless"
                                }`}
                              aria-hidden="true"
                            />
                            {getGenderName(patient.gender)}
                            {patient.dob && ` · ${calculateAge(patient.dob)} Years`}
                          </p>

                          {/* {patient.phoneNumber && <p>{patient.phoneNumber}</p>} */}
                        </div>
                      </div>

                      <div className="patient-action-area">
                        <button
                          type="button"
                          className="patient-toggle-btn"
                          aria-expanded={expandedPatientId === patient.id}
                          onClick={() =>
                            setExpandedPatientId((current) =>
                              current === patient.id ? null : patient.id
                            )
                          }
                        >
                          <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true" />
                        </button>

                        <div
                          className={`patient-actions-wrap ${expandedPatientId === patient.id ? "show" : ""
                            }`}
                        >
                          <button
                            type="button"
                            disabled={deletingPatient}
                            onClick={() => {
                              setExpandedPatientId(null);
                              openEditPatientModal(patient);
                            }}
                          >
                            {/* <i className="fa-solid fa-pen" aria-hidden="true" /> */}
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deletingPatient}
                            onClick={() => {
                              setExpandedPatientId(null);
                              setPatientDeleteError("");
                              setPatientToDelete(patient);
                            }}
                          >
                            {/* <i className="fa-solid fa-trash" aria-hidden="true" /> */}
                            Delete
                          </button>

                          {isDefault ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleRemoveDefaultPatient();
                                setExpandedPatientId(null);
                              }}
                            >
                              Remove Default
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleSetDefaultPatient(patient);
                                setExpandedPatientId(null);
                              }}
                            >
                              Make Default
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state text-center">
                <h4>No patients found</h4>
                <p>Your registered patients will appear here.</p>
              </div>
            )}
          </div>

          {/* ==== ADDRESS SECTION ==== */}
          <div className="info-box" id="address">
            <div className="title">
              <div className="left">
                <img src="/assets/images/profile-icon4.svg" alt="" />
                <h4>Saved Addresses</h4>
              </div>

              <button
                type="button"
                className="exp-btn"
                onClick={() => setShowAddressModal(true)}
              >
                Add Address
                <img src="/assets/images/profile-icon5.svg" alt="" />
              </button>
            </div>

            {loadingAddresses ? (
              <div className="empty-state" role="status">
                <p>Loading saved addresses...</p>
              </div>
            ) : addressError ? (
              <div className="empty-state">
                <h4 role="alert">{addressError}</h4>

                <button
                  type="button"
                  className="sec_btn border-0"
                  onClick={() => setAddressRefreshKey((value) => value + 1)}
                >
                  Try Again
                </button>
              </div>
            ) : addresses.length === 0 ? (
              <div className="empty-state text-center">
                <div className="icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <h4>No saved addresses</h4>
                <p>Your saved collection addresses will appear here.</p>
              </div>
            ) : (
              <div className="patient-list">
                {addresses.map((address) => (
                  <article key={address.id} className="patient-card">
                    <div className="patient-left">
                      <div className="icon">
                        <h3>
                          {address.fullName
                            ? (() => {
                              const names = address.fullName.trim().split(/\s+/);
                              const firstInitial = names[0]?.charAt(0) || "";
                              const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0) : "";
                              return (firstInitial + lastInitial).toUpperCase();
                            })()
                            : ""}
                        </h3>
                      </div>
                      <div className="patient-dtl">
                        <h4>{address.fullName}</h4>
                        <span className="add-type">{address.addressName}</span>
                        <p>
                          {[
                            address.addressLine_1,
                            address.addressLine_2,
                            address.landMark,
                            address.pinCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p><a href={`tel:${address.contactNumber}`}>
                          <i className="fa-solid fa-phone" aria-hidden="true" />
                          {address.contactNumber}
                        </a></p>
                      </div>
                    </div>
                    <div className="patient-action-area">
                      <button
                        type="button"
                        className="patient-toggle-btn"
                        aria-expanded={expandedAddressId === address.id}
                        onClick={() =>
                          setExpandedAddressId((current) =>
                            current === address.id ? null : address.id
                          )
                        }
                      >
                        <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
                      </button>

                      <div
                        className={`patient-actions-wrap ${expandedAddressId === address.id ? "show" : ""
                          }`}
                      >
                        <button
                          type="button"
                          disabled={deletingAddress}
                          onClick={() => {
                            setExpandedAddressId(null);
                            setEditingAddress(address);
                            setShowAddressModal(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingAddress}
                          onClick={() => {
                            setExpandedAddressId(null);
                            setAddressDeleteError("");
                            setAddressToDelete(address);
                          }}
                        >
                          Delete
                        </button>
                      </div>
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

          {/* ==== My Report Section ==== */}
          <div className="info-box" id="report">
            <div className="title">
              <div className="left">
                <img src="/assets/images/profile-icon6.svg" alt="" />
                <h4>My Reports</h4>
              </div>
            </div>
            <div className="inv-tabs">
              {reportPatients.map((patient) => (
                <button
                  type="button"
                  key={patient.id}
                  className={`investigation-tab ${activePatient === patient.id ? "active" : ""
                    }`}
                  onClick={() => setActivePatient(patient.id)}
                >
                  {patient.name} ({patient.count})
                </button>
              ))}
            </div>
            <div className="inv-grid">
              {(investigations[activePatient] || []).map((item) => (
                <div className="inv-card" key={item.id}>
                  <div className="inv-top">
                    <div className="inv-user">
                      <div className="inv-icon">
                        <img src="/assets/images/profile-icon7.svg" alt="" />
                      </div>
                      <div className="inv-user-info">
                        <div className="flex-dv">
                          <h4>{item.name}</h4>
                          <span className="patient-age">
                            {item.gender}, {item.age} yrs
                          </span>
                        </div>
                        <p>Investigation ID : <span>{item.investigationId}</span></p>
                      </div>
                    </div>
                    <div className="inv-date">
                      <h6>{item.date} • {item.time}</h6>
                    </div>
                  </div>
                  <div className="inv-bottom">
                    <div className="inv-details">
                      <h6>Investigation Details</h6>
                      <div className="inv-tags">
                        {item.tests.map((test, index) => (
                          <span key={index}>{test}</span>
                        ))}
                        <span>{item.more}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cmn_btn"
                      onClick={() => handleView(item)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button className="sec_btn border-0">Load More</button>
            </div>
          </div>

        </div>
      </div>

      {/* {addressToDelete && (
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
      )} */}

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
