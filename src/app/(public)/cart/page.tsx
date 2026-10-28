"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import './page.css';
import Link from "next/link";
import {
  getCartByUser,
  removeFromCart,
  getAllSlots,
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

type CartPatient = {
  id: number | string;
  name: string;
  gender: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  isNew: boolean;
};


type CartItemRef = {
  id: number;
  productType: "test" | "package";
};

type CartGroup = {
  patientId: number | string;
  items: CartItemRef[];
};

type PatientCartGroup = {
  patientId: number;
  patient_name: string;
  patient_age: number;
  patient_gender: number;
  items: CartItem[];
};

type PatientSelectionContextType = {
  openPatientModal: (product: CartProduct) => void;
  openAddPatientModal: () => void;
  closePatientModal: () => void;
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

  return `${String(hour % 12 || 12).padStart(2, "0")}:${minute} ${hour >= 12 ? "PM" : "AM"
    }`;
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

  const [removeTarget, setRemoveTarget] = useState<{
    patientId: number;
    item: CartItem;
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
        const grouped = response.data.reduce<PatientCartGroup[]>(
          (groups, item) => {
            let patientGroup = groups.find(
              (group) => group.patientId === item.patientId,
            );

            if (!patientGroup) {
              patientGroup = {
                patientId: item.patientId,

                patient_name: item.patient_name,

                patient_age: item.patient_age,
                patient_gender: item.patient_gender,
                items: [],
              };

              groups.push(patientGroup);
            }

            patientGroup.items.push(item);

            return groups;
          },
          [],
        );

        setCartGroups(grouped);
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
      const patientTotal = group.items.reduce(
        (sum, item) => sum + Number(item.finalAmount || item.mrpAmount || 0),
        0,
      );

      return total + patientTotal;
    }, 0);
  };

  const handleRemoveItem = async (patientId: number, item: CartItem) => {
    const patientGroup = cartGroups.find(
      (group) => group.patientId === patientId,
    );

    if (!patientGroup) {
      return;
    }

    // More than one item:
    // remove directly
    if (patientGroup.items.length > 1) {
      await deleteCartItem(patientId, item);

      return;
    }

    // Last item:
    // show confirmation popup
    setRemoveTarget({
      patientId,
      item,
    });
  };

  const deleteCartItem = async (patientId: number, item: CartItem) => {
    try {
      setDeletingCartId(item.cartId);

      const response = await removeFromCart(patientId, item.item_id);

      console.log("Remove Cart Response:", response);

      // Reload latest cart from backend
      await loadCart();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Remove Cart Error:", error);
    } finally {
      setDeletingCartId(null);
    }
  };


  const confirmRemoveLastItem = async () => {
    if (!removeTarget) {
      return;
    }

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

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartGroup[];

        setCart(parsedCart);

        console.log("Cart Page Data:", parsedCart);
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

    const visibleDays = Math.min(7, Math.max(0, BOOKING_WINDOW_DAYS - dateOffset));

    const dates = Array.from({ length: visibleDays }, (_, index) => {
      return new Date(year, month - 1, day + dateOffset + index, 12);
    });

    setBookingDates(dates);

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

        // Preserve the selected address only while it remains in the list.
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
            <p>You haven’t added any lab tests yet. Browse our tests and book <span>your next health checkup.</span></p>
            <Link href="/" className="cmn_btn">Add New Tests</Link>
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
                        (count, group) => count + group.items.length,
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
                        <p>
                          <i className="fa-solid fa-venus-mars"></i>{" "}
                          {group.patient_age !== null &&
                            group.patient_age !== undefined
                            ? `${group.patient_age} Y`
                            : "Age N/A"}
                          {" • "}
                          {getGenderName(group.patient_gender)}
                        </p>
                      </div>
                    </div>
                    <div className="rt-side">
                      <button
                        type="button"
                        className="add-doc"
                        onClick={() =>
                          setOpenDoctorIndex((prev) =>
                            prev === index ? null : index,
                          )
                        }
                      >
                        + Add Doctor
                      </button>
                      {openDoctorIndex === index && (
                        <div className="add-dv">
                          <input
                            type="text"
                            placeholder="Doctor Name"
                            className="form-control"
                          />
                        </div>
                      )}
                      <button
                        className="exp-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Rx <img src="/assets/images/rx1.svg" alt="" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,.jpg,.jpeg,.png"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log("Selected file:", file);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {group.items.map((item) => (
                    <div key={item.cartId} className="card-item">
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
                              item.offerAmount || item.mrpAmount || 0,
                            ).toFixed(2)}
                          </h6>

                          {item.offerAmount &&
                            Number(item.offerAmount) <
                            Number(item.mrpAmount) && (
                              <span
                                style={{
                                  color: "#e53935",
                                  textDecoration: "line-through",
                                  fontSize: "14px",
                                }}
                              >
                                ₹{Number(item.mrpAmount).toFixed(2)}
                              </span>
                            )}
                        </div>

                        {item.offerAmount &&
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
                          disabled={deletingCartId === item.cartId}
                          onClick={() =>
                            handleRemoveItem(group.patientId, item)
                          }
                        >
                          {deletingCartId === item.cartId ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-xmark"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="attach">
                    <h6>Attach Prescription Document</h6>
                    <ul>
                      <li>
                        <img src="/assets/images/prescription.png" alt="" />
                      </li>
                      <li>
                        <img src="/assets/images/prescription.png" alt="" />
                      </li>
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
                  {/* <span>Select date</span> */}
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
                        // className={`${styles.dateButton} ${isSelected ? styles.selectedDate : ""
                        //   }`}
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
                          {date.toLocaleDateString("en-GB", {
                            month: "short",
                          })}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* <div className={styles.timeHeading}>Select time</div> */}

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
                        const timeLabel = `${formatSlotTime(
                          slot.start_time,
                        )} - ${formatSlotTime(slot.end_time)}`;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            // className={`${styles.timeSlotButton} ${isSelected && !isInactive
                            //   ? styles.selectedTimeSlot
                            //   : ""
                            //   }`}
                            className={`timeSlotButton ${isSelected && !isInactive ? "active" : ""}`}
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
                          // className={`${styles.addressCard} ${isSelected ? styles.selectedAddress : ""
                          //   }`}
                          className={`add-card ${isSelected ? "selectedAddress" : ""}`}
                        >
                          <label className="add-box">
                            {/* <span
                              className={styles.addressAvatar}
                              aria-hidden="true"
                            >
                              {address.fullName
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </span> */}
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
            {/* Coupons */}
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="coupon">
                <div className="inn">
                  <div className="has-no-coupon text-center d-none">
                    <img src="/assets/images/empty-img2.svg" alt="" />
                    <h3>Sorry! no coupons available</h3>
                    <p>Sorry no coupons available at the moment</p>
                  </div>
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
                    <div className="box">
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
                    <div className="box">
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
                    <div className="box">
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
                  {/* <span>Patients</span>
                  <span>{cartGroups.length}</span>
                  <span>Items</span>
                  <span>
                    {cartGroups.reduce(
                      (count, group) => count + group.items.length,
                      0,
                    )}
                  </span> */}
                  <ul className="amt">
                    <li>
                      <span>Gross Amount</span> ₹ 2,500.00
                    </li>
                    <li>
                      <span>Net Amount</span> ₹ 414.00
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
            {/* Delete Icon */}
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

            {/* Patient */}
            <div className={styles.removePatientCard}>
              <div className={styles.removePatientLeft}>
                <div className={styles.removeAvatar}>P</div>

                <div>
                  <h4>{removePatient.patient_name}</h4>

                  <p>Patient details will be loaded from server</p>
                </div>
              </div>

              <span className={styles.testCountBadge}>
                {removePatient.items.length}{" "}
                {removePatient.items.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Buttons */}
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
    </section>
  );


}
