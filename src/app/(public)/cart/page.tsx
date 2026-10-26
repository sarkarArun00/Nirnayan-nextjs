"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
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

  return `${String(hour % 12 || 12).padStart(2, "0")}:${minute} ${
    hour >= 12 ? "PM" : "AM"
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

  const removePatient = removeTarget
    ? cartGroups.find((group) => group.patientId === removeTarget.patientId)
    : null;
    
    return (
      <section
        style={{
          padding: "50px 0",
          background: "#f7f9f8",
          minHeight: "70vh",
        }}
      >
        <div className="container">
          {/* <div
            style={{
              marginBottom: "25px",
            }}
          >
            <h1
              style={{
                fontSize: "30px",
                fontWeight: 700,
                marginBottom: "5px",
              }}
            >
              Your Cart (
              {cartGroups.reduce(
                (count, group) => count + group.items.length,
                0,
              )}
              )
            </h1>

            <p
              style={{
                margin: 0,
                color: "#777",
              }}
            >
              Review tests and packages selected for each patient.
            </p>
          </div> */}

          <div className={styles.cartHeading}>
            <div>
              <h1>
                Your Cart (
                {cartGroups.reduce(
                  (count, group) => count + group.items.length,
                  0,
                )}
                )
              </h1>
              <p>Review tests and packages selected for each patient.</p>
            </div>

            <button
              type="button"
              className={styles.addPatientButton}
              onClick={openAddPatientModal}
            >
              Add Patient
            </button>
          </div>

          {cartGroups.length === 0 ? (
            <div
              style={{
                background: "#fff",
                padding: "50px 20px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <h3>Your cart is empty</h3>

              <p>Add a test or package to continue.</p>
            </div>
          ) : (
            <div className="row">
              {/* LEFT SIDE */}
              <div className="col-lg-8">
                {cartGroups.map((group) => (
                  <div key={group.patientId} className={styles.patientCart}>
                    <div className={styles.patientHeader}>
                      <div>
                        <h3>{group.patient_name}</h3>

                        <p>
                          {group.items.length}{" "}
                          {group.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    {group.items.map((item) => (
                      <div key={item.cartId} className={styles.cartItem}>
                        <div>
                          <span>
                            {item.productType === "test" ? "Test" : "Package"}
                          </span>

                          <h4>{item.test_name}</h4>

                          <small>{item.test_code}</small>
                        </div>

                        <div>
                          <strong>
                            ₹
                            {Number(
                              item.finalAmount || item.mrpAmount || 0,
                            ).toFixed(2)}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className={styles.removeItemBtn}
                          disabled={deletingCartId === item.cartId}
                          onClick={() =>
                            handleRemoveItem(group.patientId, item)
                          }
                        >
                          {deletingCartId === item.cartId ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-trash"></i>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

                <section
                  className={styles.bookingSection}
                  aria-labelledby="booking-slot-heading"
                >
                  <div className={styles.bookingHeader}>
                    <div className={styles.bookingHeading}>
                      <i
                        className={`fa-solid fa-calendar-days ${styles.bookingIcon}`}
                        aria-hidden="true"
                      />

                      <div>
                        <h2 id="booking-slot-heading">Book Your Slot</h2>
                        <p>
                          Choose your preferred date and time for sample
                          collection.
                        </p>
                      </div>
                    </div>

                    {!loadingSlots && !slotError && slots.length > 0 && (
                      <span className={styles.slotCount}>
                        {slots.length} Time{" "}
                        {slots.length === 1 ? "Slot" : "Slots"}
                      </span>
                    )}
                  </div>

                  <div className={styles.dateNavigation}>
                    <span>Select date</span>

                    <div className={styles.dateNavigationActions}>
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
                    className={styles.dateList}
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
                          className={`${styles.dateButton} ${
                            isSelected ? styles.selectedDate : ""
                          }`}
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

                  <div className={styles.timeHeading}>Select time</div>

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
                        <p className={styles.bookingMessage}>
                          Select a date to choose a time slot.
                        </p>
                      )}

                      <div
                        className={styles.timeSlotList}
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
                              className={`${styles.timeSlotButton} ${
                                isSelected && !isInactive
                                  ? styles.selectedTimeSlot
                                  : ""
                              }`}
                              disabled={!selectedBookingDate || isInactive}
                              aria-pressed={isSelected && !isInactive}
                              aria-label={`${slot.slot_label}, ${timeLabel}${
                                isInactive ? ", unavailable" : ""
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
                  className={styles.addressSection}
                  aria-labelledby="cart-address-heading"
                >
                  <div className={styles.addressSectionHeader}>
                    <div className={styles.addressTitle}>
                      <i
                        className={`fa-solid fa-house ${styles.addressIcon}`}
                        aria-hidden="true"
                      />

                      <div>
                        <h2 id="cart-address-heading">Address</h2>
                        <p>
                          Choose your preferred address for sample collection.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.addAddressButton}
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
                        onClick={() =>
                          setAddressRefreshKey((value) => value + 1)
                        }
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
                      className={styles.addressGrid}
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
                            className={`${styles.addressCard} ${
                              isSelected ? styles.selectedAddress : ""
                            }`}
                          >
                            <label className={styles.addressChoice}>
                              <span
                                className={styles.addressAvatar}
                                aria-hidden="true"
                              >
                                {address.fullName
                                  .trim()
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>

                              <div className={styles.addressDetails}>
                                <div className={styles.addressNameRow}>
                                  <h3>{address.fullName}</h3>

                                  <span className={styles.addressType}>
                                    {address.addressName}
                                  </span>
                                </div>

                                <p className={styles.addressText}>
                                  {addressText}
                                </p>

                                <span className={styles.addressContact}>
                                  <i
                                    className="fa-solid fa-phone"
                                    aria-hidden="true"
                                  />
                                  {address.contactNumber}
                                </span>
                              </div>

                              <input
                                type="radio"
                                name="cartCollectionAddress"
                                className={styles.addressRadio}
                                value={address.id}
                                checked={isSelected}
                                onChange={() =>
                                  setSelectedAddressId(address.id)
                                }
                                aria-label={`Select ${address.addressName} address for ${address.fullName}`}
                              />
                            </label>

                            <details className={styles.addressActions}>
                              <summary
                                aria-label={`Actions for ${address.fullName}'s ${address.addressName} address`}
                              >
                                <i
                                  className="fa-solid fa-ellipsis-vertical"
                                  aria-hidden="true"
                                />
                              </summary>

                              <div className={styles.addressActionsMenu}>
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
              <div className="col-lg-4">
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "22px",
                    border: "1px solid #e8e8e8",
                    position: "sticky",
                    top: "110px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "19px",
                      marginBottom: "20px",
                    }}
                  >
                    Order Summary
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      color: "#666",
                    }}
                  >
                    <span>Patients</span>

                    <span>{cartGroups.length}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "18px",
                      color: "#666",
                    }}
                  >
                    <span>Items</span>

                    <span>
                      {cartGroups.reduce(
                        (count, group) => count + group.items.length,
                        0,
                      )}
                    </span>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #eee",
                      paddingTop: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>Total</strong>

                    <strong
                      style={{
                        fontSize: "22px",
                        color: "#079653",
                      }}
                    >
                      ₹{getTotal().toFixed(2)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="cmn_btn"
                    style={{
                      width: "100%",
                      marginTop: "22px",
                    }}
                  >
                    Proceed
                  </button>
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
