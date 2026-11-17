"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import "./page.css";
import Link from "next/link";

import {
  getCartByUser,
  removeFromCart,
  getAllSlots,
  getSelectedStateId,
  updateCartDetails,
  getAllPatientAddresses,
  deletePatientAddress,
  getAllCoupons,
  type CouponItem,
  type PatientAddress,
  type BookingSlot,
} from "@/services/cart.service";
import AddressModal from "@/components/common/AddressModal/AddressModal";
import { usePatientSelection } from "@/components/common/PatientSelectionModal/PatientSelectionProvider";

import { useAlert } from "@/components/common/Alert/AlertProvider";
import {
  createCheckoutOrder,
  processToCheckout,
  type CheckoutBookingDetails,
  type RazorpayPaymentResult,
} from "@/actions/checkout.actions";
import Script from "next/script";
import { getLoggedInUser } from "@/actions/session.actions";

type RazorpayResult = RazorpayPaymentResult;

type PendingCheckout = {
  details: CheckoutBookingDetails;
  payment: RazorpayResult;
};

type RazorpayOptions = {
  key: string;
  order_id: string;
  amount: number;
  currency: "INR";
  name: string;
  description: string;
  theme: { color: string };
  handler: (result: RazorpayResult) => void;
  modal: { ondismiss: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open(): void };
  }
}

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
};

export type PatientCartGroup = {
  cartId: number;
  patientId: number;
  patient_name: string;
  patient_age: number | null;
  patient_gender: number | null;
  doctor_name: string | null;
  attachments: string[];
  investigation: InvestigationItem[];
};

function getItemPrice(item: InvestigationItem): number {
  return Number(item.finalAmount ?? item.offerAmount ?? item.mrpAmount ?? 0);
}

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
const checkoutCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function CartPage() {
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
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartLoadError, setCartLoadError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [activePrescriptionModal, setActivePrescriptionModal] =
    useState<PatientCartGroup | null>(null);
  const [modalDoctorName, setModalDoctorName] = useState("");
  const [modalFiles, setModalFiles] = useState<File[]>([]);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [coupons, setCoupons] = useState<CouponItem[]>([]);

  const [loadingCoupons, setLoadingCoupons] = useState(true);

  const [couponError, setCouponError] = useState("");

  const [couponCode, setCouponCode] = useState("");

  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

  const { confirm } = useAlert();
  const { showAlert } = useAlert();

  const paymentBusyRef = useRef(false);

  const [removeTarget, setRemoveTarget] = useState<{
    patientId: number;
    item: InvestigationItem;
  } | null>(null);

  const [deletingBookingId, setDeletingBookingId] = useState<number | null>(
    null,
  );
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
  const checkoutPreviewRef = useRef<HTMLDialogElement>(null);

  // const selectedCoupon =
  //   coupons.find((coupon) => coupon.couponId === selectedCouponId) ?? null;

  const [pendingPayment, setPendingPayment] = useState<PendingCheckout | null>(
    null,
  );

  const loadCart = async () => {
    try {
      setLoadingCart(true);
      setCartLoadError("");

      const response: unknown = await getCartByUser();

      if (typeof response !== "object" || response === null) {
        throw new Error("Invalid cart response.");
      }

      if (!("status" in response) || response.status !== 1) {
        const message = "message" in response ? response.message : undefined;
        throw new Error(
          typeof message === "string" ? message : "Unable to load your cart.",
        );
      }

      if (!("data" in response) || !Array.isArray(response.data)) {
        throw new Error("Invalid cart response.");
      }

      const groups = response.data as PatientCartGroup[];
      if (
        groups.some((group) => !group || !Array.isArray(group.investigation))
      ) {
        throw new Error("Cart response is missing grouped investigations.");
      }

      setCartGroups(groups);
    } catch (error: unknown) {
      setCartLoadError(
        error instanceof Error ? error.message : "Unable to load your cart.",
      );
    } finally {
      setLoadingCart(false);
    }
  };

  const handleApplyCoupon = (coupon?: CouponItem) => {
    let selected = coupon;

    // When coupon code is entered manually
    if (!selected) {
      const enteredCode = couponCode.trim().toLowerCase();

      selected = coupons.find(
        (item) => item.couponCode.trim().toLowerCase() === enteredCode,
      );
    }

    if (!selected) {
      setCouponError("Coupon code is not available.");
      return;
    }

    const minLimit = Number(selected.minlimit ?? 0);

    const maxLimit =
      selected.maxlimit !== null && selected.maxlimit !== undefined
        ? Number(selected.maxlimit)
        : null;

    // Minimum limit validation
    if (totalAmount < minLimit) {
      setCouponError(
        `Minimum order amount ₹${minLimit.toFixed(
          2,
        )} is required to apply this coupon.`,
      );

      return;
    }

    // Maximum limit validation
    // Only check when maxlimit has a value
    if (maxLimit !== null && totalAmount > maxLimit) {
      setCouponError(
        `This coupon is applicable only up to ₹${maxLimit.toFixed(2)}.`,
      );

      return;
    }

    setCouponError("");

    setSelectedCouponId(selected.couponId);

    setCouponCode(selected.couponCode);
  };

  const handleRemoveCoupon = () => {
    setSelectedCouponId(null);
    setCouponCode("");
    setCouponError("");
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

  useEffect(() => {
    let cancelled = false;

    const loadCoupons = async () => {
      try {
        setLoadingCoupons(true);
        setCouponError("");

        console.log("Calling coupon API...");

        const response = await getAllCoupons();

        console.log("Coupon API Response:", response);

        if (cancelled) {
          return;
        }

        if (response?.status === 1 && Array.isArray(response.data)) {
          setCoupons(response.data);
        } else {
          setCoupons([]);
        }
      } catch (error) {
        console.error("Coupon API Error:", error);

        if (!cancelled) {
          setCoupons([]);

          setCouponError(
            error instanceof Error ? error.message : "Unable to load coupons.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingCoupons(false);
        }
      }
    };

    void loadCoupons();

    return () => {
      cancelled = true;
    };
  }, []);

  const investigations = cartGroups.flatMap((group) => group.investigation);

  const grossAmount = investigations.reduce(
    (sum, item) => sum + Number(item.mrpAmount ?? 0),
    0,
  );

  const totalAmount = investigations.reduce(
    (sum, item) => sum + getItemPrice(item),
    0,
  );

  const offerDiscount = Math.max(0, grossAmount - totalAmount);

  const selectedCoupon =
    coupons.find((coupon) => coupon.couponId === selectedCouponId) ?? null;

  const couponMinLimit = Number(selectedCoupon?.minlimit ?? 0);

  const couponMaxLimit =
    selectedCoupon?.maxlimit !== null && selectedCoupon?.maxlimit !== undefined
      ? Number(selectedCoupon.maxlimit)
      : null;

  const isCouponAmountValid =
    selectedCoupon !== null &&
    totalAmount >= couponMinLimit &&
    (couponMaxLimit === null || totalAmount <= couponMaxLimit);

  const couponDiscount =
    isCouponAmountValid && selectedCoupon?.discount_type === "1"
      ? Number(selectedCoupon.max_discount_amount ?? 0)
      : 0;

  const payableAmount = Math.max(0, totalAmount - couponDiscount);

  const checkoutDate = selectedBookingDate
    ? new Date(`${selectedBookingDate}T00:00:00+05:30`).toLocaleDateString(
        "en-IN",
        { dateStyle: "full", timeZone: "Asia/Kolkata" },
      )
    : null;
  const checkoutSlot = slots.find(
    (slot) => slot.id === selectedSlotId && slot.threshold !== 0,
  );
  const checkoutAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  const missingCheckoutFields: string[] = [];

  if (!checkoutDate) {
    missingCheckoutFields.push("a collection date and time slot");
  } else if (!checkoutSlot) {
    missingCheckoutFields.push("an available time slot");
  }

  if (!checkoutAddress) {
    missingCheckoutFields.push("a collection address");
  }

  const canCheckout =
    investigations.length > 0 &&
    !loadingSlots &&
    !loadingAddresses &&
    missingCheckoutFields.length === 0;

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
      setDeletingBookingId(item.bookingId);
      const response = await removeFromCart(patientId, item.item_id);
      console.log("Remove Cart Response:", response);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Remove Cart Error:", error);
    } finally {
      setDeletingBookingId(null);
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

  const [updatingCartId, setUpdatingCartId] = useState<number | null>(null);

  // Handler to submit Doctor Name or Prescription updates
  const handleUpdateCartDetails = async (
    cartId: number,
    doctorName?: string,
    files?: File[],
  ) => {
    try {
      setUpdatingCartId(cartId);
      const currentDocName = doctorName ?? "";
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

  const handlePayNow = async () => {
    if (paymentBusyRef.current) return;

    let proof = pendingPayment;
    paymentBusyRef.current = true;
    setPaymentBusy(true);
    setPaymentMessage("");

    try {
      if (!proof) {
        if (!canCheckout || !checkoutSlot || !checkoutAddress) {
          setPaymentMessage(
            "Select a collection date, time slot, and address.",
          );
          return;
        }

        const Razorpay = window.Razorpay;
        if (!Razorpay) {
          setPaymentMessage("Payment is still loading. Please try again.");
          return;
        }

        const order = await createCheckoutOrder(
          {
            cartIds: cartGroups.map((group) => group.cartId),

            patientIds: [
              ...new Set(cartGroups.map((group) => group.patientId)),
            ],

            slot_date: selectedBookingDate,

            slot_id: checkoutSlot.id,

            address_id: checkoutAddress.id,

            coupon_id: selectedCoupon?.couponId ?? null,
          },

          getSelectedStateId(),
        );

        if (order.amount !== Math.round(payableAmount * 100)) {
          setPaymentMessage(
            "Your total changed. Refresh the cart and review it again.",
          );
          return;
        }

        // Close the native dialog before opening Razorpay's overlay.
        checkoutPreviewRef.current?.close();

        const result = await new Promise<RazorpayResult | null>((resolve) => {
          const checkout = new Razorpay({
            key: order.keyId,
            order_id: order.orderId,
            amount: order.amount,
            currency: order.currency,
            name: "Nirnayan Healthcare",
            description: "Diagnostic test booking",
            theme: { color: "#00A651" },
            handler: resolve,
            modal: { ondismiss: () => resolve(null) },
          });

          checkout.open();
        });

        if (!result) {
          setPaymentMessage("Payment window closed.");
          checkoutPreviewRef.current?.showModal();
          return;
        }

        proof = { details: order.details, payment: result };
        setPendingPayment(proof);
      }

      ///// debug //////
      const user = await getLoggedInUser();

      if (!user?.id) {
        throw new Error("Please sign in before confirming your booking.");
      }

      const checkoutPayload = {
        userId: user.id,

        cartIds: proof.details.cartIds,

        patientIds: proof.details.patientIds,

        slot_date: proof.details.slot_date,

        slot_id: proof.details.slot_id,

        address_id: proof.details.address_id,

        paymentStatus: 1,

        paymentType: "Online",

        paymentId: proof.payment.razorpay_payment_id,

        transaction_id: proof.payment.razorpay_payment_id,

        gross_amount: proof.details.gross_amount,

        net_amount: proof.details.net_amount,

        offer_discount: proof.details.offer_discount,

        coupon_id: proof.details.coupon_id ?? null,

        coupon_discount: proof.details.coupon_discount,

        total_amount: proof.details.total_amount,

        platform: "website",
      };

      console.log("FINAL CHECKOUT API PAYLOAD:", checkoutPayload);

      //// debug ////

      const checkoutResult = await processToCheckout(
        proof.details,
        proof.payment,
      );

      if (!checkoutResult.bookingSaved) {
        throw new Error("Booking could not be confirmed.");
      }

      setPendingPayment(null);
      checkoutPreviewRef.current?.close();

      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
      window.alert("Your booking is confirmed.");
    } catch (error) {
      const fallbackMessage = proof
        ? "Booking confirmation is pending. Use Retry Confirmation."
        : "Unable to open payment. Please try again.";

      setPaymentMessage(
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : fallbackMessage,
      );

      const dialog = checkoutPreviewRef.current;
      if (dialog && !dialog.open) dialog.showModal();
    } finally {
      paymentBusyRef.current = false;
      setPaymentBusy(false);
    }
  };

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

  const getGenderName = (gender: number | null) => {
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

        {cartLoadError ? (
          <div className="text-center py-5" role="alert">
            <p>{cartLoadError}</p>
            <button
              type="button"
              className="cmn_btn"
              onClick={() => void loadCart()}
            >
              Try Again
            </button>
          </div>
        ) : cartGroups.length === 0 ? (
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
                    <h4>Cart Item(s) ({investigations.length})</h4>
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

              {cartGroups.map((group) => (
                <div key={group.cartId} className="pt-card">
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

                  {group.investigation.map((item) => {
                    const price = getItemPrice(item);
                    const hasDiscount =
                      item.mrpAmount > 0 && price < item.mrpAmount;

                    return (
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
                              ₹{price.toFixed(2)}
                              {hasDiscount && (
                                <del>₹{item.mrpAmount.toFixed(2)}</del>
                              )}
                            </h6>
                          </div>

                          {hasDiscount && (
                            <span className="is-discount">
                              {Math.round(
                                ((item.mrpAmount - price) / item.mrpAmount) *
                                  100,
                              )}
                              % Off
                            </span>
                          )}

                          <button
                            type="button"
                            className="remove"
                            aria-label={`Remove ${item.test_name}`}
                            disabled={deletingBookingId === item.bookingId}
                            onClick={() =>
                              handleRemoveItem(group.patientId, item)
                            }
                          >
                            {deletingBookingId === item.bookingId ? (
                              <i
                                className="fa-solid fa-spinner fa-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <i
                                className="fa-solid fa-xmark"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}

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
                                    <h6>PDF</h6>
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
                            <a
                              onClick={() => {
                                setActivePrescriptionModal(group);
                                setModalDoctorName(group.doctor_name || "");
                                setModalFiles([]);
                              }}
                            >
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
                            className={`timeSlotButton ${
                              isSelected && !isInactive ? "active" : ""
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
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                    />

                    <button type="button" onClick={() => handleApplyCoupon()}>
                      Check
                    </button>
                  </div>
                  <div className="scroll-dv">
                    {loadingCoupons ? (
                      <p>Loading coupons...</p>
                    ) : coupons.length === 0 ? (
                      <p>No coupons available.</p>
                    ) : (
                      coupons.map((coupon) => {
                        const isApplied = selectedCouponId === coupon.couponId;

                        return (
                          <div
                            key={coupon.couponId}
                            className={`box ${isApplied ? "active" : ""}`}
                          >
                            <div className="left-sec">
                              <div className="lt-side">
                                <div className="icon">
                                  <img src="/assets/images/coupon.svg" alt="" />
                                </div>

                                <div className="text">
                                  <h4>{coupon.couponName}</h4>

                                  <p>{coupon.descriptionDetails}</p>
                                </div>
                              </div>

                              {coupon.discount_percent > 0 && (
                                <h6>{coupon.discount_percent}% discount</h6>
                              )}
                            </div>

                            {selectedCouponId === coupon.couponId ? (
                              <button
                                type="button"
                                className="cmn_btn"
                                onClick={handleRemoveCoupon}
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="cmn_btn"
                                onClick={() => handleApplyCoupon(coupon)}
                              >
                                Apply
                              </button>
                            )}

                            <span className="dis-tag">{coupon.couponCode}</span>
                          </div>
                        );
                      })
                    )}

                    {couponError && (
                      <p className="text-danger mt-2">{couponError}</p>
                    )}
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
                      <span>Gross Amount</span> ₹ {grossAmount.toFixed(2)}
                    </li>
                    <li>
                      <span>Net Amount</span> ₹ {totalAmount.toFixed(2)}
                    </li>
                    <li>
                      <span>Offer Discount</span> ₹ {offerDiscount.toFixed(2)}
                    </li>
                    <li>
                      <span>Coupon Discount</span>

                      {selectedCoupon ? (
                        <span>- ₹ {couponDiscount.toFixed(2)}</span>
                      ) : (
                        <span>₹ 0.00</span>
                      )}
                    </li>
                  </ul>
                  <div className="total-amount">
                    <div className="lt-side">
                      <h6>Total Amount</h6>
                      <h4>₹{payableAmount.toFixed(2)}</h4>
                    </div>
                    <div className="rt-side">
                      <button
                        type="button"
                        className="cmn_btn"
                        aria-haspopup="dialog"
                        aria-controls="cart-checkout-preview"
                        disabled={
                          investigations.length === 0 ||
                          loadingSlots ||
                          loadingAddresses
                        }
                        onClick={() => {
                          if (!canCheckout) {
                            window.alert(
                              `Please select ${missingCheckoutFields.join(" and ")}.`,
                            );
                            return;
                          }

                          checkoutPreviewRef.current?.showModal();
                        }}
                      >
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

      <dialog
        id="cart-checkout-preview"
        ref={checkoutPreviewRef}
        aria-labelledby="checkout-preview-heading"
        aria-describedby="checkout-preview-description"
        className="border-0 rounded-4 shadow p-0"
        style={{
          width: "min(680px, calc(100% - 32px))",
          maxWidth: "none",
          maxHeight: "calc(100dvh - 32px)",
          margin: "auto",
        }}
      >
        <div
          className="d-flex flex-column bg-white"
          style={{ maxHeight: "calc(100dvh - 32px)" }}
        >
          <header className="d-flex justify-content-between align-items-start gap-3 border-bottom p-4">
            <div>
              <h2 id="checkout-preview-heading" className="h4 mb-1">
                Review Your Booking
              </h2>
              <p
                id="checkout-preview-description"
                className="small text-muted mb-0"
              >
                Review your tests, packages, and collection details.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-light border"
              aria-label="Close checkout preview"
              onClick={() => checkoutPreviewRef.current?.close()}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </header>

          <div className="overflow-auto p-4">
            <h3 className="h6 mb-3">
              Patients and Tests ({investigations.length})
            </h3>

            {cartGroups.map((group) => (
              <section key={group.cartId} className="rounded-3 border p-3 mb-3">
                <h4 className="h6 mb-1">{group.patient_name}</h4>
                <p className="small text-muted mb-2">
                  {group.patient_age != null && `${group.patient_age} Y · `}
                  {getGenderName(group.patient_gender)}
                </p>
                {group.doctor_name && (
                  <p className="small mb-2">Doctor: {group.doctor_name}</p>
                )}
                <ul className="list-unstyled mb-0">
                  {group.investigation.map((item) => (
                    <li
                      key={item.bookingId}
                      className="d-flex justify-content-between align-items-start gap-3 border-top py-2"
                    >
                      <div>
                        <span className="d-block">{item.test_name}</span>
                        <small className="text-muted">
                          {item.productType === "package"
                            ? "Health package"
                            : "Test"}
                        </small>
                      </div>
                      <strong className="text-nowrap">
                        {checkoutCurrency.format(getItemPrice(item))}
                      </strong>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <div className="row g-3 mt-1">
              <section className="col-12 col-sm-6">
                <div className="border rounded-3 p-3 h-100">
                  <h3 className="h6 mb-2">Collection Slot</h3>
                  <p className="small mb-1">
                    {checkoutDate ?? "No date selected"}
                  </p>
                  <p className="small mb-0">
                    {checkoutSlot
                      ? `${formatSlotTime(checkoutSlot.start_time)} – ${formatSlotTime(checkoutSlot.end_time)}`
                      : "No time slot selected"}
                  </p>
                </div>
              </section>
              <section className="col-12 col-sm-6">
                <div className="border rounded-3 p-3 h-100">
                  <h3 className="h6 mb-2">Collection Address</h3>
                  {checkoutAddress ? (
                    <>
                      <p className="small fw-semibold mb-1">
                        {checkoutAddress.fullName} ·{" "}
                        {checkoutAddress.addressName}
                      </p>
                      <p className="small mb-1">
                        {[
                          checkoutAddress.addressLine_1,
                          checkoutAddress.addressLine_2,
                          checkoutAddress.landMark,
                          checkoutAddress.pinCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="small mb-0">
                        {checkoutAddress.contactNumber}
                      </p>
                    </>
                  ) : (
                    <p className="small mb-0">No address selected</p>
                  )}
                </div>
              </section>
            </div>

            {offerDiscount > 0 && (
              <p className="small mb-0 mt-3" style={{ color: "#08783f" }}>
                Offer savings: {checkoutCurrency.format(offerDiscount)}
              </p>
            )}
          </div>

          <footer className="d-flex justify-content-between align-items-center flex-wrap gap-3 border-top p-4">
            <div>
              <span className="d-block small text-muted">Total Amount</span>
              <strong className="h4 mb-0" style={{ color: "#08783f" }}>
                {checkoutCurrency.format(payableAmount)}
              </strong>
            </div>
            <form method="dialog" className="m-0">
              <button
                type="button"
                className="cmn_btn"
                disabled={paymentBusy}
                onClick={() => void handlePayNow()}
              >
                {paymentBusy
                  ? "Processing…"
                  : pendingPayment
                    ? "Retry Confirmation"
                    : "Pay Now"}
              </button>
              {paymentMessage && (
                <p className="small text-danger px-4 mb-3" role="alert">
                  {paymentMessage}
                </p>
              )}
            </form>
          </footer>
        </div>
      </dialog>

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
          <div className="inn" onClick={(e) => e.stopPropagation()}>
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
              <label>Doctor's Name</label>
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
              <label>Upload Prescription (PDF, JPG, PNG)</label>
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

      <Script
        id="razorpay-checkout"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onError={() =>
          console.error("[Checkout] Razorpay script failed to load")
        }
      />
    </section>
  );
}
