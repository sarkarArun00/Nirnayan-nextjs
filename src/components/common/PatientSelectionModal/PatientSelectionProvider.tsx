"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import styles from "./PatientSelectionModal.module.css";
import { getAllPatients, PatientItem } from "@/services/patient.service";
import { getLoggedInUser } from "@/actions/session.actions";
import {
  createPatient,
  CreatePatientPayload,
} from "@/services/patient.service";


export type CartProduct = {
  id: number;
  name: string;
  productType: "test" | "package";
  price?: string;
};

type TempPatient = {
  id: number | string;
  name: string;
  gender: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  isNew: boolean;
};


type TempCartGroup = {
  patient: TempPatient;
  items: CartProduct[];
};

const TEMP_CART_KEY = "nirnayan_temp_cart";

type PatientMode = "choose" | "new" | "existing";

type PatientSelectionContextType = {
  openPatientModal: (product: CartProduct) => void;

  closePatientModal: () => void;
};

const PatientSelectionContext = createContext<
  PatientSelectionContextType | undefined
>(undefined);

type Props = {
  children: ReactNode;
};

export function PatientSelectionProvider({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [mode, setMode] = useState<PatientMode>("choose");

  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(
    null,
  );

  const router = useRouter();

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null,
  );

  const [patients, setPatients] = useState<PatientItem[]>([]);

  const [patientLoading, setPatientLoading] = useState(false);

  const [newPatient, setNewPatient] = useState({
    title: "",
    patientName: "",
    dob: "",
    bloodGroup: "",
    gender: "Male",
    phoneNumber: "",
    email: "",
  });

  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const [makeDefaultPatient, setMakeDefaultPatient] = useState(false);

  const STATIC_SCHEMA_NAME = "nir1691144565";
  const STATIC_CENTRE_ID = 13;

  const loadPatients = async () => {
    try {
      setPatientLoading(true);
      const user = await getLoggedInUser();
          if (!user?.id) {
            throw new Error("User not logged in.");
          }

          const userId = Number(user.id);
      const response = await getAllPatients({ user_id: userId });

      console.log("Patient API Response:", response);

      if (response?.data && Array.isArray(response.data)) {
        setPatients(response.data);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Patient API Error:", error);

      setPatients([]);
    } finally {
      setPatientLoading(false);
    }
  };

  const saveToTempCart = (patient: TempPatient, product?: CartProduct) => {
  const cartProduct = product || selectedProduct;

  if (!cartProduct) {
    console.warn("No product selected");

    return;
  }
  if (!cartProduct) {
    console.warn("No product selected");
    return;
  }

  try {
    const savedCart = localStorage.getItem(TEMP_CART_KEY);

    const cart: TempCartGroup[] = savedCart ? JSON.parse(savedCart) : [];

    let patientGroup = cart.find(
      (group) => String(group.patient.id) === String(patient.id),
    );

    // Patient not in cart yet
    if (!patientGroup) {
      patientGroup = {
        patient,
        items: [],
      };

      cart.push(patientGroup);
    }

    // Prevent same product duplicate
    const alreadyExists = patientGroup.items.some(
      (item) =>
        item.id === cartProduct.id &&
        item.productType === cartProduct.productType,
    );

    if (!alreadyExists) {
      patientGroup.items.push(cartProduct);
    }

    localStorage.setItem(TEMP_CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    console.log("Temporary Cart:", cart);

    console.log("Patient:", patient);

    console.log("Product:", selectedProduct);

    closePatientModal();

    router.push("/cart");
  } catch (error) {
    console.error("Temporary cart save error:", error);
  }
};

  const [creatingPatient, setCreatingPatient] = useState(false);
  
  const openPatientModal = async (product: CartProduct) => {
    try {
      const user = await getLoggedInUser();

      if (user?.id) {
        const defaultPatientKey = `nirnayan_default_patient_${user.id}`;

        const savedDefaultPatient = localStorage.getItem(defaultPatientKey);

        if (savedDefaultPatient) {
          const defaultPatient = JSON.parse(savedDefaultPatient) as TempPatient;

          console.log("Using Default Patient:", defaultPatient);

          saveToTempCart(defaultPatient, product);

          return;
        }
      }
    } catch (error) {
      console.error("Unable to read default patient:", error);
    }

    // No default patient → open modal normally
    setSelectedProduct(product);

    setMode("choose");

    setSelectedPatientId(null);

    setMakeDefaultPatient(false);

    setNewPatient({
      title: "",
      patientName: "",
      dob: "",
      bloodGroup: "",
      gender: "Male",
      phoneNumber: "",
      email: "",
    });

    setIsOpen(true);
  };

  const getGenderName = (gender: number) => {
    if (gender === 1) {
      return "Male";
    }

    if (gender === 2) {
      return "Female";
    }

    return "Other";
  };


  
  const getPatientImageUrl = (path: string) => {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    const baseUrl = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL || "";

    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${cleanBase}${cleanPath}`;
  };

  const closePatientModal = () => {
    setIsOpen(false);
    setMode("choose");
  };

  const calculateAge = (dob: string) => {
    if (!dob) {
      return 0;
    }

    const birthDate = new Date(dob);

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleCreatePatient = async () => {
    if (!newPatient.title) {
      return;
    }

    if (!newPatient.patientName.trim()) {
      return;
    }

    if (!newPatient.dob) {
      return;
    }

    if (!newPatient.bloodGroup) {
      return;
    }

    if (newPatient.phoneNumber.length !== 10) {
      return;
    }

    try {
      setCreatingPatient(true);

      const payload: CreatePatientPayload = {
        schemaName: STATIC_SCHEMA_NAME,
        centre_id: STATIC_CENTRE_ID,

        patientName: newPatient.patientName.trim(),

        age: calculateAge(newPatient.dob),

        blood_group: newPatient.bloodGroup,

        gender:
          newPatient.gender === "Male"
            ? 1
            : newPatient.gender === "Female"
              ? 2
              : 3,

        dob: newPatient.dob,

        height: 0,
        weight: 0,

        title: newPatient.title,

        phoneNumber: newPatient.phoneNumber,

        altPhoneNumber: "",

        patientAddress: "",

        patientEmail: newPatient.email.trim(),
      };

      console.log('resssss patient payload: ', payload)
      return
      const response = await createPatient(payload);

      if (response?.status !== 1 || !response?.success || !response?.data?.id) {
        throw new Error(response?.message || "Unable to create patient.");
      }

      const createdPatient: TempPatient = {
        id: response.data.id,

        name: response.data.patient_name,

        dob: newPatient.dob,

        bloodGroup: String(response.data.blood_group ?? ""),

        gender:
          response.data.gender === 1
            ? "Male"
            : response.data.gender === 2
              ? "Female"
              : "Other",

        age: calculateAge(newPatient.dob),

        isNew: true,
      };

      if (makeDefaultPatient) {
        saveDefaultPatient(createdPatient);
      }

      saveToTempCart(createdPatient);
    } catch (error) {
      console.error("Create Patient Error:", error);
    } finally {
      setCreatingPatient(false);
    }
  };

  const saveDefaultPatient = (patient: TempPatient) => {
    if (!loggedInUserId) {
      console.warn("Cannot save default patient: user id missing");

      return;
    }

    const key = `nirnayan_default_patient_${loggedInUserId}`;

    localStorage.setItem(key, JSON.stringify(patient));

    console.log("Default Patient Saved:", patient);
  };

  useEffect(() => {
    const loadLoggedInUser = async () => {
      try {
        const user = await getLoggedInUser();

        if (user?.id) {
          setLoggedInUserId(user.id);

          console.log("Patient Modal User ID:", user.id);
        }
      } catch (error) {
        console.error("Unable to get logged-in user:", error);
      }
    };

    void loadLoggedInUser();
  }, []);

  return (
    <PatientSelectionContext.Provider
      value={{
        openPatientModal,
        closePatientModal,
      }}
    >
      {children}

      {isOpen && (
        <div className={styles.backdrop} onClick={closePatientModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={closePatientModal}
            >
              ×
            </button>

            {/* Header */}
            <div className={styles.header}>
              <h3>Add Patient</h3>

              <p>
                Add a new patient or select an existing patient to continue.
              </p>
            </div>

            {/* Selection Cards */}
            <div className={styles.typeGrid}>
              {/* New Patient */}
              <button
                type="button"
                className={`${styles.typeCard} ${
                  mode === "new" ? styles.active : ""
                }`}
                onClick={() => setMode("new")}
              >
                <span className={styles.patientIcon}>♙+</span>

                <strong>Add New Patient</strong>

                <small>Register a new patient with their details</small>
              </button>

              {/* Existing Patient */}
              <button
                type="button"
                className={`${styles.typeCard} ${
                  mode === "existing" ? styles.active : ""
                }`}
                onClick={() => {
                  setMode("existing");
                  setSelectedPatientId(null);

                  void loadPatients();
                }}
              >
                <span className={styles.patientIcon}>♙♙</span>

                <strong>Select Existing Patient</strong>

                <small>Find and select a patient already registered.</small>
              </button>
            </div>

            {/* ======================
          ADD NEW PATIENT
      ====================== */}

            {mode === "new" && (
              <div className={styles.patientSection}>
                <h4>Add New Patient</h4>

                <div className={styles.formGroup}>
                  <label>
                    Title
                    <span>*</span>
                  </label>

                  <select
                    value={newPatient.title}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        title: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Select Title
                    </option>

                    <option value="Mr.">Mr.</option>

                    <option value="Mrs.">Mrs.</option>

                    <option value="Ms.">Ms.</option>

                    {/* <option value="Master">Master</option>
                    <option value="Baby">Baby</option> */}
                  </select>
                </div>

                {/* First Name */}
                <div className={styles.formGroup}>
                  <label>
                    First Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newPatient.patientName}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        patientName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formRow}>
                  {/* DOB */}
                  <div className={styles.formGroup}>
                    <label>
                      DOB
                      <span>*</span>
                    </label>

                    <input
                      type="date"
                      value={newPatient.dob}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          dob: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Mobile Number
                      <span>*</span>
                    </label>

                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      maxLength={10}
                      value={newPatient.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        setNewPatient({
                          ...newPatient,
                          phoneNumber: value,
                        });
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email</label>

                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={newPatient.email}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Blood Group */}
                  <div className={styles.formGroup}>
                    <label>Blood Group</label>

                    <select
                      value={newPatient.bloodGroup}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          bloodGroup: e.target.value,
                        })
                      }
                    >
                      <option value="">Blood Group</option>

                      <option value="A+">A+</option>

                      <option value="A-">A-</option>

                      <option value="B+">B+</option>

                      <option value="B-">B-</option>

                      <option value="AB+">AB+</option>

                      <option value="AB-">AB-</option>

                      <option value="O+">O+</option>

                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div className={styles.formGroup}>
                  <label>
                    Gender
                    <span>*</span>
                  </label>

                  <div className={styles.genderRow}>
                    <button
                      type="button"
                      className={
                        newPatient.gender === "Male" ? styles.genderActive : ""
                      }
                      onClick={() =>
                        setNewPatient({
                          ...newPatient,
                          gender: "Male",
                        })
                      }
                    >
                      ♂ Male
                    </button>

                    <button
                      type="button"
                      className={
                        newPatient.gender === "Female"
                          ? styles.genderActive
                          : ""
                      }
                      onClick={() =>
                        setNewPatient({
                          ...newPatient,
                          gender: "Female",
                        })
                      }
                    >
                      ♀ Female
                    </button>

                    <button
                      type="button"
                      className={
                        newPatient.gender === "Other" ? styles.genderActive : ""
                      }
                      onClick={() =>
                        setNewPatient({
                          ...newPatient,
                          gender: "Other",
                        })
                      }
                    >
                      ⚧ Other
                    </button>
                  </div>
                </div>

                <div className={styles.defaultPatient}>
                  <label>
                    <input
                      type="checkbox"
                      checked={makeDefaultPatient}
                      onChange={(e) => setMakeDefaultPatient(e.target.checked)}
                    />

                    <span>Make this my default patient</span>
                  </label>

                  <small>
                    Future tests and packages will be added directly for this
                    patient.
                  </small>
                </div>

                {/* Add Patient */}
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={handleCreatePatient}
                  disabled={creatingPatient}
                >
                  {creatingPatient ? "Adding Patient..." : "Add Patient"}
                </button>
              </div>
            )}

            {/* ======================
          EXISTING PATIENT
      ====================== */}

            {mode === "existing" && (
              <div className={styles.patientSection}>
                <h4>Select Patient</h4>

                <div className={styles.patientList}>
                  {patientLoading ? (
                    <div className={styles.patientLoading}>
                      Loading patients...
                    </div>
                  ) : patients.length > 0 ? (
                    patients.map((patient) => (
                      <button
                        type="button"
                        key={patient.id}
                        className={`${styles.patientCard} ${
                          selectedPatientId === patient.id
                            ? styles.selectedPatient
                            : ""
                        }`}
                        onClick={() => setSelectedPatientId(patient.id)}
                      >
                        <div className={styles.patientLeft}>
                          <div className={styles.avatar}>
                            {patient.patient_profile ? (
                              <img
                                src={getPatientImageUrl(
                                  patient.patient_profile,
                                )}
                                alt={patient.patient_name}
                              />
                            ) : (
                              <span>
                                {patient.patient_name?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className={styles.patientInfo}>
                            <strong>{patient.patient_name}</strong>

                            <span>
                              {getGenderName(patient.gender)}

                              {patient.dob &&
                                ` · ${calculateAge(patient.dob)} Y`}
                            </span>

                            {patient.blood_group && (
                              <small>Blood Group: {patient.blood_group}</small>
                            )}
                          </div>
                        </div>

                        <span
                          className={`${styles.checkbox} ${
                            selectedPatientId === patient.id
                              ? styles.checked
                              : ""
                          }`}
                        >
                          {selectedPatientId === patient.id ? "✓" : ""}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className={styles.emptyPatient}>
                      No patients found.
                    </div>
                  )}
                </div>

                <div className={styles.defaultPatient}>
                  <label>
                    <input
                      type="checkbox"
                      checked={makeDefaultPatient}
                      onChange={(e) => setMakeDefaultPatient(e.target.checked)}
                    />

                    <span>Make this my default patient</span>
                  </label>

                  <small>
                    Skip patient selection next time and add items directly to
                    this patient.
                  </small>
                </div>

                <button
                  type="button"
                  className={styles.primaryBtn}
                  disabled={!selectedPatientId}
                  onClick={() => {
                    const patient = patients.find(
                      (item) => item.id === selectedPatientId,
                    );

                    if (!patient) {
                      return;
                    }

                    const selectedPatient: TempPatient = {
                      id: patient.id,

                      name: patient.patient_name,

                      gender: getGenderName(patient.gender),

                      age: patient.dob ? calculateAge(patient.dob) : undefined,

                      dob: patient.dob || undefined,

                      bloodGroup:
                        patient.blood_group !== null
                          ? String(patient.blood_group)
                          : undefined,

                      isNew: false,
                    };

                    if (makeDefaultPatient) {
                      saveDefaultPatient(selectedPatient);
                    }

                    saveToTempCart(selectedPatient);
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </PatientSelectionContext.Provider>
  );
}

export function usePatientSelection() {
  const context = useContext(PatientSelectionContext);

  if (!context) {
    throw new Error(
      "usePatientSelection must be used inside PatientSelectionProvider",
    );
  }

  return context;
}
