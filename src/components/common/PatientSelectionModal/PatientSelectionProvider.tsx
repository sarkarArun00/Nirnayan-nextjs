"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PatientSelectionModal.module.css";

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

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    dob: "",
    bloodGroup: "",
    gender: "Male",
  });

  const dummyPatients = [
    {
      id: 1,
      name: "Tarun Sana",
      age: 33,
      gender: "Male",
      image: "/assets/images/user.png",
    },
    {
      id: 2,
      name: "Emma Wilson",
      age: 33,
      gender: "Female",
      image: "/assets/images/user.png",
    },
    {
      id: 3,
      name: "Rahul Sharma",
      age: 33,
      gender: "Male",
      image: "/assets/images/user.png",
    },
    {
      id: 4,
      name: "Michael Brown",
      age: 33,
      gender: "Male",
      image: "/assets/images/user.png",
    },
  ];

  const saveToTempCart = (patient: TempPatient) => {
    if (!selectedProduct) {
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
          item.id === selectedProduct.id &&
          item.productType === selectedProduct.productType,
      );

      if (!alreadyExists) {
        patientGroup.items.push(selectedProduct);
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

  const openPatientModal = (product: CartProduct) => {
    setSelectedProduct(product);

    setMode("choose");

    setSelectedPatientId(null);

    setNewPatient({
      firstName: "",
      dob: "",
      bloodGroup: "",
      gender: "Male",
    });

    setIsOpen(true);
  };

  const closePatientModal = () => {
    setIsOpen(false);
    setMode("choose");
  };

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
                onClick={() => setMode("existing")}
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

                {/* First Name */}
                <div className={styles.formGroup}>
                  <label>
                    First Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newPatient.firstName}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        firstName: e.target.value,
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
                  </div>
                </div>

                {/* Add Patient */}
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => {
                    if (!newPatient.firstName.trim() || !newPatient.dob) {
                      return;
                    }

                    const patient: TempPatient = {
                      id: `temp-${Date.now()}`,
                      name: newPatient.firstName.trim(),
                      dob: newPatient.dob,
                      bloodGroup: newPatient.bloodGroup,
                      gender: newPatient.gender,
                      isNew: true,
                    };

                    saveToTempCart(patient);
                  }}
                >
                  Add Patient
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
                  {dummyPatients.map((patient) => (
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
                          <img src={patient.image} alt={patient.name} />
                        </div>

                        <div className={styles.patientInfo}>
                          <strong>{patient.name}</strong>

                          <span>
                            ♀ {patient.age} Y · {patient.gender}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`${styles.checkbox} ${
                          selectedPatientId === patient.id ? styles.checked : ""
                        }`}
                      >
                        {selectedPatientId === patient.id ? "✓" : ""}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className={styles.primaryBtn}
                  disabled={!selectedPatientId}
                  onClick={() => {
                    const patient = dummyPatients.find(
                      (item) => item.id === selectedPatientId,
                    );

                    if (!patient) {
                      return;
                    }

                    const selectedPatient: TempPatient = {
                      id: patient.id,
                      name: patient.name,
                      age: patient.age,
                      gender: patient.gender,
                      isNew: false,
                    };

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
