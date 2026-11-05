"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import "./page.css";
import Link from "next/link";
import {
  getCartByUser,
  removeFromCart,
  getAllSlots,
  updateCartDetails,
  getAllPatientAddresses,
  deletePatientAddress,
  type PatientAddress,
  type CartItem,
  type BookingSlot,
} from "@/services/cart.service";
import AddressModal from "@/components/common/AddressModal/AddressModal";
import { usePatientSelection } from "@/components/common/PatientSelectionModal/PatientSelectionProvider";

type CartProduct = {
  id: number;
  name: string;
  productType: "test" | "package";
  price?: string;
};

type CartItemRef = {
  id: number;
  productType: "test" | "package";
};

type CartGroup = {
  patientId: number | string;
  items: CartItemRef[];
};

// Updated to match the nested investigation structure from the new backend response
export type InvestigationItem = {
  bookingId: number;
  item_id: number;
  productType: "package" | "test";
  test_name: string;
  test_code: string;
  tat: {
    normalTat: { value: string; isHour: boolean };
    urgentTat: { value: string; isHour: boolean };
  };
  homeCollection: boolean;
  mrpAmount: number;
  offerAmount: number | null;
  finalAmount: number;
  cartId?: number; // added optionally for tracking
};

export type PatientCartGroup = {
  cartId: number;
  patientId: number;
  patient_name: string;
  patient_age: number;
  patient_gender: number;
  doctor_name: string | null;
  attachments: any[];
  investigation: InvestigationItem[];
};

const CART_KEY = "nirnayan_temp_cart";

function getBookingDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSlotTime(time: string): string {
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
}

const BOOKING_WINDOW_DAYS = 15;

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartGroup[]>([]);

  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotError, setSlotError] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const [bookingDates, setBookingDates] = useState<Date[]>([]);
  const [selectedBookingDate, setSelectedBookingDate] = useState("");
  const [dateOffset, setDateOffset] = useState(0);

  const [addresses, setAddresses] = useState<PatientAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [addressRefreshKey, setAddressRefreshKey] = useState(0);

  const [cartGroups, setCartGroups] = useState<PatientCartGroup[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Add this state inside your CartPage component
  const [activePrescriptionModal, setActivePrescriptionModal] =
    useState<PatientCartGroup | null>(null);
  const [modalDoctorName, setModalDoctorName] = useState("");
  const [modalFiles, setModalFiles] = useState<File[]>([]);

  const [removeTarget, setRemoveTarget] = useState<{
    patientId: number;
    item: InvestigationItem;
  } | null>(null);

  const [deletingCartId, setDeletingCartId] = useState<number | null>(null);
  const [editingAddress, setEditingAddress] = useState<
    PatientAddress | undefined
  >(undefined);
  const [addressToDelete, setAddressToDelete] = useState<PatientAddress | null>(
    null,
  );
  const { openAddPatientModal } = usePatientSelection();
  const [deletingAddress, setDeletingAddress] = useState(false);
  const [addressDeleteError, setAddressDeleteError] = useState("");

  const addressDeleteDialogRef = useRef<HTMLDialogElement>(null);
  const addressDeletePendingRef = useRef(false);
  const [openDoctorIndex, setOpenDoctorIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCart = async () => {
    try {
      setLoadingCart(true);
      const response = await getCartByUser();

      if (response?.status === 1 && Array.isArray(response.data)) {
        // Since backend response is already grouped by patient with an 'investigation' array,
        // we can directly set it into state, mapping cartId down or handling fields directly.
        const mappedGroups: PatientCartGroup[] = response.data.map(
          (group: any) => ({
            cartId: group.cartId,
            patientId: group.patientId,
            patient_name: group.patient_name,
            patient_age: group.patient_age,
            patient_gender: group.patient_gender,
            doctor_name: group.doctor_name,
            attachments: group.attachments || [],
            investigation: (group.investigation || []).map((inv: any) => ({
              ...inv,
              cartId: group.cartId, // Attach cartId reference for item removal/tracking if needed
            })),
          }),
        );

        setCartGroups(mappedGroups);
      } else {
        setCartGroups([]);
      }
    } catch (error) {
      console.error("Get Cart Error:", error);
      setCartGroups([]);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        setSlotError("");
        const response = await getAllSlots();
        if (cancelled) return;

        const activeSlots = response.data.filter(
          (slot) => slot.status === true,
        );
        setSlots(activeSlots);
      } catch (error: unknown) {
        if (cancelled) return;
        setSlots([]);
        setSlotError(
          error instanceof Error
            ? error.message
            : "Unable to load booking slots. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    };

    void loadSlots();
    return () => {
      cancelled = true;
    };
  }, []);

  const getTotal = () => {
    return cartGroups.reduce((total, group) => {
      const patientTotal = group.investigation.reduce(
        (sum, item) => sum + Number(item.finalAmount || item.mrpAmount || 0),
        0,
      );
      return total + patientTotal;
    }, 0);
  };

  const handleRemoveItem = async (
    patientId: number,
    item: InvestigationItem,
  ) => {
    const patientGroup = cartGroups.find(
      (group) => group.patientId === patientId,
    );
    if (!patientGroup) return;

    if (patientGroup.investigation.length > 1) {
      await deleteCartItem(patientId, item);
      return;
    }

    setRemoveTarget({ patientId, item });
  };

  const deleteCartItem = async (patientId: number, item: InvestigationItem) => {
    try {
      setDeletingCartId(item.bookingId);
      const response = await removeFromCart(patientId, item.item_id);
      console.log("Remove Cart Response:", response);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Remove Cart Error:", error);
    } finally {
      setDeletingCartId(null);
    }
  };

  const confirmRemoveLastItem = async () => {
    if (!removeTarget) return;
    await deleteCartItem(removeTarget.patientId, removeTarget.item);
    setRemoveTarget(null);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete || addressDeletePendingRef.current) return;
    const addressId = addressToDelete.id;

    try {
      addressDeletePendingRef.current = true;
      setDeletingAddress(true);
      setAddressDeleteError("");

      await deletePatientAddress(addressId);
      setSelectedAddressId((currentId) =>
        currentId === addressId ? null : currentId,
      );
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

  // Add states inside CartPage for tracking inputs per group if needed:
  const [doctorNames, setDoctorNames] = useState<{ [key: number]: string }>({});
  const [updatingCartId, setUpdatingCartId] = useState<number | null>(null);

  // Handler to submit Doctor Name or Prescription updates
  const handleUpdateCartDetails = async (
    cartId: number,
    doctorName?: string,
    files?: File[],
  ) => {
    try {
      setUpdatingCartId(cartId);
      const currentDocName = doctorName ?? doctorNames[cartId] ?? "";
      const selectedFiles = files ?? [];

      const response = await updateCartDetails(
        cartId,
        currentDocName,
        selectedFiles,
      );
      console.log("Cart details updated successfully:", response);

      // Refresh the cart data to reflect updates from backend
      await loadCart();
    } catch (error) {
      console.error("Error updating cart details:", error);
    } finally {
      setUpdatingCartId(null);
    }
  };

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartGroup[];
        setCart(parsedCart);
      }
    } catch (error) {
      console.error("Cart load error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const year = Number(parts.find((part) => part.type === "year")?.value);
    const month = Number(parts.find((part) => part.type === "month")?.value);
    const day = Number(parts.find((part) => part.type === "day")?.value);

    const visibleDays = Math.min(
      7,
      Math.max(0, BOOKING_WINDOW_DAYS - dateOffset),
    );
    const dates = Array.from({ length: visibleDays }, (_, index) => {
      return new Date(year, month - 1, day + dateOffset + index, 12);
    });

    setBookingDates(dates);
  }, [dateOffset]);

  useEffect(() => {
    let cancelled = false;

    const loadAddresses = async () => {
      try {
        setLoadingAddresses(true);
        setAddressError("");
        const response = await getAllPatientAddresses();
        if (cancelled) return;

        const activeAddresses = response.data.filter(
          (address) =>
            address.status === true && address.delete_status !== true,
        );

        setAddresses(activeAddresses);
        setSelectedAddressId((currentId) =>
          activeAddresses.some((address) => address.id === currentId)
            ? currentId
            : null,
        );
      } catch (error: unknown) {
        if (cancelled) return;
        setAddresses([]);
        setSelectedAddressId(null);
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

  if (loadingCart) {
    return <div className="container py-5">Loading cart...</div>;
  }

  const getGenderName = (gender: number) => {
    switch (gender) {
      case 1:
        return "Male";
      case 2:
        return "Female";
      case 3:
        return "Other";
      default:
        return "N/A";
    }
  };

  const removePatient = removeTarget
    ? cartGroups.find((group) => group.patientId === removeTarget.patientId)
    : null;

  return (
    <section className="cart-dtl">
      <div className="container">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">Cart</li>
        </ol>

        {cartGroups.length === 0 ? (
          <div className="empty-cart text-center">
            <img src="/assets/images/empty-img1.svg" alt="" />
            <h3>No Tests Added Yet</h3>
            <p>
              You haven’t added any lab tests yet. Browse our tests and book{" "}
              <span>your next health checkup.</span>
            </p>
            <Link href="/" className="cmn_btn">
              Add New Tests
            </Link>
          </div>
        ) : (
          <div className="row">
            {/* LEFT SIDE */}
            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="cart-head">
                <div className="left">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <div className="text-block">
                    <h4>
                      Cart Item(s) (
                      {cartGroups.reduce(
                        (count, group) => count + group.investigation.length,
                        0,
                      )}
                      )
                    </h4>
                    <p>
                      Review the items you’ve added to your cart and make any
                      changes before proceeding to checkout.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="sec_btn border-0"
                  onClick={openAddPatientModal}
                >
                  Add Patient
                </button>
              </div>

              {cartGroups.map((group, index) => (
                <div key={group.patientId} className="pt-card">
                  <div className="pt-head">
                    <div className="lt-side">
                      <div className="icon">
                        <img src="/assets/images/user2.png" alt="" />
                      </div>
                      <div className="text">
                        <h6>{group.patient_name}</h6>
                        <div className="d-flex gap-2">
                          <p>
                            <i className="fa-solid fa-venus-mars"></i>{" "}
                            {group.patient_age !== null &&
                              group.patient_age !== undefined
                              ? `${group.patient_age} Y`
                              : "Age N/A"}
                            {" • "}
                            {getGenderName(group.patient_gender)}
                          </p>

                          {/* Display Doctor Name if updated */}
                          {group.doctor_name && (
                            <h5 className="mb-0">
                              <i className="fa-solid fa-user-doctor"></i> Dr.{" "}
                              {group.doctor_name}
                            </h5>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rt-side">
                      <button
                        type="button"
                        className="exp-btn"
                        onClick={() => {
                          setActivePrescriptionModal(group);
                          setModalDoctorName(group.doctor_name || "");
                          setModalFiles([]);
                        }}
                      >
                        {group.doctor_name ||
                          (group.attachments && group.attachments.length > 0)
                          ? "Edit Rx & Doctor"
                          : "Upload Rx & Doctor"}
                        <img
                          src="/assets/images/rx1.svg"
                          alt=""
                          className="ms-1"
                        />
                      </button>
                    </div>
                  </div>

                  {group.investigation.map((item) => (
                    <div key={item.bookingId} className="card-item">
                      <div className="lt-side">
                        <div className="icon">
                          <img src="/assets/images/laboratory1.svg" alt="" />
                        </div>
                        <h6>{item.test_name}</h6>
                      </div>
                      <div className="rt-side">
                        <div className="d-flex align-items-center gap-2">
                          <h6>
                            ₹
                            {Number(
                              item.offerAmount ??
                              item.finalAmount ??
                              item.mrpAmount ??
                              0,
                            ).toFixed(2)}
                            {item.offerAmount !== null &&
                              item.offerAmount !== undefined &&
                              Number(item.offerAmount) <
                              Number(item.mrpAmount) && (
                                <del>₹{Number(item.mrpAmount).toFixed(2)}</del>
                              )}
                          </h6>
                        </div>

                        {item.offerAmount !== null &&
                          item.offerAmount !== undefined &&
                          Number(item.offerAmount) < Number(item.mrpAmount) && (
                            <span className="is-discount">
                              {Math.round(
                                ((Number(item.mrpAmount) -
                                  Number(item.offerAmount)) /
                                  Number(item.mrpAmount)) *
                                100,
                              )}
                              % Off
                            </span>
                          )}

                        <button
                          type="button"
                          className="remove"
                          disabled={deletingCartId === item.bookingId}
                          onClick={() =>
                            handleRemoveItem(group.patientId, item)
                          }
                        >
                          {deletingCartId === item.bookingId ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-xmark"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="attach">
                    <h6>Attached Prescription Document(s)</h6>
                    <ul>
                      {group.attachments && group.attachments.length > 0 ? (
                        group.attachments.map((att, attIdx) => {
                          const isPdf = att.toLowerCase().endsWith(".pdf");
                          const fileUrl = att.startsWith("http")
                            ? att
                            : `${process.env.NEXT_PUBLIC_LIMS_API_BASE_URL?.replace(/\/$/, "")}/${att.replace(/^\//, "")}`;

                          return (
                            <li key={attIdx} style={{ position: "relative" }}>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Prescription"
                              >
                                {isPdf ? (
                                  <>
                                    <i className="fa-solid fa-file-pdf"></i>
                                    <h6>
                                      PDF
                                    </h6>
                                  </>
                                ) : (
                                  <>
                                    <i className="fa-solid fa-image"></i>
                                    <h6>IMAGE</h6>
                                    <img
                                      src={fileUrl}
                                      alt="Prescription Attachment"
                                      className="d-none"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                      }}
                                    />
                                  </>
                                )}
                              </a>
                            </li>
                          );
                        })
                      ) : (
                        <>
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-file-circle-plus"></i>
                            <h6>Add File</h6>
                          </a>
                        </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="text-center">
                    <Link className="add-btn" href="/">
                      + Add more tests or health checkup packages
                    </Link>
                  </div>
                </div>
              ))}

              <section
                className="booking-wrap"
                aria-labelledby="booking-slot-heading"
              >
                <div className="booking-head">
                  <div className="left-block">
                    <i
                      className={`fa-solid fa-calendar-days ${styles.booking_icon}`}
                      aria-hidden="true"
                    />
                    <div className="text-block">
                      <h4>Book Your Slot</h4>
                      <p>
                        Choose your preferred date and time for sample
                        collection.
                      </p>
                    </div>
                  </div>

                  {!loadingSlots && !slotError && slots.length > 0 && (
                    <span className="slot-count">
                      {slots.length} Time{" "}
                      {slots.length === 1 ? "Slot" : "Slots"}
                    </span>
                  )}
                </div>

                <div className="date-nav-head">
                  <div className="date-nav">
                    <button
                      type="button"
                      aria-label="Previous seven days"
                      disabled={dateOffset === 0}
                      onClick={() =>
                        setDateOffset((offset) => Math.max(0, offset - 7))
                      }
                    >
                      <i
                        className="fa-solid fa-chevron-left"
                        aria-hidden="true"
                      />
                    </button>

                    <button
                      type="button"
                      aria-label="Next dates"
                      disabled={dateOffset + 7 >= BOOKING_WINDOW_DAYS}
                      onClick={() =>
                        setDateOffset((offset) =>
                          offset + 7 < BOOKING_WINDOW_DAYS
                            ? offset + 7
                            : offset,
                        )
                      }
                    >
                      <i
                        className="fa-solid fa-chevron-right"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                <div
                  className="date-list"
                  role="group"
                  aria-label="Collection date"
                >
                  {bookingDates.map((date) => {
                    const dateValue = getBookingDateValue(date);
                    const isSelected = selectedBookingDate === dateValue;

                    return (
                      <button
                        key={dateValue}
                        type="button"
                        className={`dateButton ${isSelected ? "selectedDate" : ""}`}
                        aria-pressed={isSelected}
                        aria-label={date.toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        onClick={() => {
                          setSelectedBookingDate(dateValue);
                          setSelectedSlotId(null);
                        }}
                      >
                        <span>
                          {date.toLocaleDateString("en-GB", {
                            weekday: "short",
                          })}
                        </span>
                        <strong>{date.getDate()}</strong>
                        <span>
                          {date.toLocaleDateString("en-GB", { month: "short" })}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {loadingSlots ? (
                  <p className={styles.bookingMessage} role="status">
                    Loading time slots...
                  </p>
                ) : slotError ? (
                  <p className={styles.bookingError} role="alert">
                    {slotError}
                  </p>
                ) : slots.length === 0 ? (
                  <p className={styles.bookingMessage}>
                    No active time slots were returned.
                  </p>
                ) : (
                  <>
                    {!selectedBookingDate && (
                      <p className="booking-msg">
                        Select a date to choose a time slot.
                      </p>
                    )}

                    <div
                      className="slot-list"
                      role="group"
                      aria-label="Collection time"
                    >
                      {slots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        const isInactive = slot.threshold === 0;
                        const timeLabel = `${formatSlotTime(slot.start_time)} - ${formatSlotTime(
                          slot.end_time,
                        )}`;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            className={`timeSlotButton ${isSelected && !isInactive ? "active" : ""
                              }`}
                            disabled={!selectedBookingDate || isInactive}
                            aria-pressed={isSelected && !isInactive}
                            aria-label={`${slot.slot_label}, ${timeLabel}${isInactive ? ", unavailable" : ""
                              }`}
                            onClick={() => setSelectedSlotId(slot.id)}
                          >
                            {timeLabel}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </section>

              <section
                className="booking-wrap"
                aria-labelledby="cart-address-heading"
              >
                <div className="booking-head">
                  <div className="left-block">
                    <i className="fa-solid fa-house"></i>
                    <div className="text-block">
                      <h4>Address</h4>
                      <p>
                        Choose your preferred address for sample collection.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="exp-btn"
                    onClick={() => {
                      setEditingAddress(undefined);
                      setShowAddressModal(true);
                    }}
                  >
                    Add Address
                    <i className="fa-solid fa-plus" aria-hidden="true" />
                  </button>
                </div>

                {loadingAddresses ? (
                  <p className={styles.addressMessage} role="status">
                    Loading saved addresses...
                  </p>
                ) : addressError ? (
                  <div className={styles.addressError}>
                    <p role="alert">{addressError}</p>
                    <button
                      type="button"
                      className={styles.addressRetryButton}
                      onClick={() => setAddressRefreshKey((value) => value + 1)}
                    >
                      Try Again
                    </button>
                  </div>
                ) : addresses.length === 0 ? (
                  <p className={styles.addressMessage}>
                    You have no saved addresses. Add an address to continue.
                  </p>
                ) : (
                  <div
                    className="add-grid"
                    role="group"
                    aria-label="Sample collection address"
                  >
                    {addresses.map((address) => {
                      const isSelected = selectedAddressId === address.id;
                      const addressText = [
                        address.addressLine_1,
                        address.addressLine_2,
                        address.landMark,
                        String(address.pinCode),
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <article
                          key={address.id}
                          className={`add-card ${isSelected ? "selectedAddress" : ""}`}
                        >
                          <label className="add-box">
                            <div className="icon">
                              <img alt="" src="/assets/images/user2.png" />
                            </div>
                            <div className="text-block">
                              <h4>{address.fullName}</h4>
                              <h5 className="add-type">
                                {address.addressName}
                              </h5>
                              <p>{addressText}</p>
                              <h6>
                                <i className="fa-solid fa-phone"></i>
                                {address.contactNumber}
                              </h6>
                            </div>

                            <input
                              type="radio"
                              name="cartCollectionAddress"
                              className={styles.addressRadio}
                              value={address.id}
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(address.id)}
                              aria-label={`Select ${address.addressName} address for ${address.fullName}`}
                            />
                          </label>

                          <details className="add-act">
                            <summary
                              aria-label={`Actions for ${address.fullName}'s ${address.addressName} address`}
                            >
                              <i
                                className="fa-solid fa-ellipsis-vertical"
                                aria-hidden="true"
                              />
                            </summary>

                            <div className="add-menu">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.currentTarget
                                    .closest("details")
                                    ?.removeAttribute("open");
                                  setEditingAddress(address);
                                  setShowAddressModal(true);
                                }}
                              >
                                <i
                                  className="fa-solid fa-pen"
                                  aria-hidden="true"
                                />
                                Edit
                              </button>

                              <button
                                type="button"
                                className={styles.addressDeleteAction}
                                onClick={(event) => {
                                  event.currentTarget
                                    .closest("details")
                                    ?.removeAttribute("open");
                                  setAddressDeleteError("");
                                  setAddressToDelete(address);
                                }}
                              >
                                <i
                                  className="fa-solid fa-trash"
                                  aria-hidden="true"
                                />
                                Delete
                              </button>
                            </div>
                          </details>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="coupon">
                <div className="inn">
                  <div className="coupon-head">
                    <div className="icon">
                      <img src="/assets/images/coupon-icon.svg" alt="" />
                    </div>
                    <h4>Coupons Available</h4>
                  </div>
                  <div className="inp-box">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      className="form-control"
                    />
                    <button>Check</button>
                  </div>
                  <div className="scroll-dv">
                    <div className="box active">
                      <div className="left-sec">
                        <div className="lt-side">
                          <div className="icon">
                            <img src="/assets/images/coupon.svg" alt="" />
                          </div>
                          <div className="text">
                            <h4>20% Off</h4>
                            <p>Complete health screening package</p>
                          </div>
                        </div>
                        <h6>Upto Rs. 250 on minimum purchase of Rs. 300.</h6>
                      </div>
                      <button className="cmn_btn">Apply</button>
                      <span className="dis-tag">HEALTH20</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="coupon">
                <div className="inn">
                  <div className="coupon-head">
                    <div className="icon">
                      <img src="/assets/images/price.svg" alt="" />
                    </div>
                    <h4>Your Price Summary</h4>
                  </div>
                  <ul className="amt">
                    <li>
                      <span>Gross Amount</span> ₹ {getTotal().toFixed(2)}
                    </li>
                    <li>
                      <span>Net Amount</span> ₹ {getTotal().toFixed(2)}
                    </li>
                    <li>
                      <span>Offer Discount</span> ₹ 0.00
                    </li>
                    <li>
                      <span>Coupon Discount</span> Apply Coupon
                    </li>
                  </ul>
                  <div className="total-amount">
                    <div className="lt-side">
                      <h6>Total Amount</h6>
                      <h4>₹{getTotal().toFixed(2)}</h4>
                    </div>
                    <div className="rt-side">
                      <button type="button" className="cmn_btn">
                        Proceed to Checkout
                      </button>
                      <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
                        <img src="/assets/images/shield.svg" alt="" />
                        <h6 className="m-0">Secure checkout</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {removeTarget && removePatient && (
        <div
          className={styles.removeModalBackdrop}
          onClick={() => setRemoveTarget(null)}
        >
          <div
            className={styles.removeModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.deleteIcon}>
              <i className="fa-solid fa-trash-can"></i>
            </div>

            <h2>Are You Sure?</h2>
            <p className={styles.removeMessage}>
              Are you sure you want to{" "}
              <strong>
                remove patient and all the tests associated with them
              </strong>{" "}
              from the cart?
            </p>

            <div className={styles.removePatientCard}>
              <div className={styles.removePatientLeft}>
                <div className={styles.removeAvatar}>P</div>
                <div>
                  <h4>{removePatient.patient_name}</h4>
                  <p>Patient details will be loaded from server</p>
                </div>
              </div>

              <span className={styles.testCountBadge}>
                {removePatient.investigation.length}{" "}
                {removePatient.investigation.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className={styles.removeActions}>
              <button
                type="button"
                className={styles.removeConfirmBtn}
                onClick={confirmRemoveLastItem}
              >
                Remove
              </button>

              <button
                type="button"
                className={styles.continueBtn}
                onClick={() => setRemoveTarget(null)}
              >
                Continue
              </button>
            </div>
          </div>
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

      {activePrescriptionModal && (
        <div
          className="cmn-backdrop active"
          onClick={() => setActivePrescriptionModal(null)}
        >
          <div
            className="inn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="header">
              <h4 className="m-0">Add Prescription & Doctor</h4>
            </div>
            <button
              type="button"
              className="closeBtn"
              onClick={() => setActivePrescriptionModal(null)}
            ></button>

            <div className="mb-3">
              <label>Doctor's Name</label>
              <input
                type="text"
                placeholder="Enter doctor's name (e.g. Dr. Sharma)"
                className="form-control"
                value={modalDoctorName}
                onChange={(e) => setModalDoctorName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>
                Upload Prescription (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="form-control"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setModalFiles(files);
                }}
              />
              {modalFiles.length > 0 && (
                <small className="text-success mt-1 d-block">
                  {modalFiles.length} file(s) selected
                </small>
              )}
            </div>

            <div className="d-flex gap-2 justify-content-end">
              {/* <button
                type="button"
                className="btn btn-light border px-3"
                onClick={() => setActivePrescriptionModal(null)}
              >
                Cancel
              </button> */}
              <button
                type="button"
                className="cmn_btn"
                disabled={updatingCartId === activePrescriptionModal.cartId}
                onClick={async () => {
                  await handleUpdateCartDetails(
                    activePrescriptionModal.cartId,
                    modalDoctorName,
                    modalFiles,
                  );
                  setActivePrescriptionModal(null);
                }}
              >
                {updatingCartId === activePrescriptionModal.cartId
                  ? "Saving..."
                  : "Save Details"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activePrescriptionModal && (
        <div
          className="cmn-backdrop active"
          onClick={() => setActivePrescriptionModal(null)}
        >
          <div
            className="inn"
            onClick={(e) => e.stopPropagation()}

          >
            {/* Header */}
            <button
              type="button"
              className="closeBtn"
              aria-label="Close"
              onClick={() => setActivePrescriptionModal(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="header">
              <h4>Add Prescription & Doctor</h4>
            </div>


            {/* Doctor Name Field */}
            <div className="mb-3">
              <label>
                Doctor's Name
              </label>
              <input
                type="text"
                placeholder="Enter doctor's name (e.g. Dr. Sharma)"
                className="form-control form-control-lg"
                style={{ fontSize: "0.95rem", padding: "10px 14px" }}
                value={modalDoctorName}
                onChange={(e) => setModalDoctorName(e.target.value)}
              />
            </div>

            {/* File Upload Field */}
            <div className="mb-3">
              <label>
                Upload Prescription (PDF, JPG, PNG)
              </label>
              <div className="input-group">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="form-control form-control-lg"
                  style={{ fontSize: "0.95rem", padding: "9px 14px" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setModalFiles(files);
                  }}
                />
              </div>
              {modalFiles.length > 0 && (
                <small className="text-success fw-medium mt-1 d-block">
                  <i className="fa-solid fa-check-circle me-1"></i>{" "}
                  {modalFiles.length} file(s) selected
                </small>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 justify-content-end pt-2">
              {/* <button
                type="button"
                className="btn btn-light border px-4 py-2 fw-medium"
                onClick={() => setActivePrescriptionModal(null)}
                style={{ borderRadius: "8px" }}
              >
                Cancel
              </button> */}
              <button
                type="button"
                className="cmn_btn"
                disabled={updatingCartId === activePrescriptionModal.cartId}
                onClick={async () => {
                  await handleUpdateCartDetails(
                    activePrescriptionModal.cartId,
                    modalDoctorName,
                    modalFiles,
                  );
                  setActivePrescriptionModal(null);
                }}
              >
                {updatingCartId === activePrescriptionModal.cartId
                  ? "Saving..."
                  : "Save Details"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
