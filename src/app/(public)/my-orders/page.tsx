"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

import { getAllOrders, type OrderItem } from "@/services/order.service";
import PhleboTrackingMap from "@/components/orders/PhleboTrackingMap";
import './page.css';
type OrderTab = "all" | "active" | "completed" | "cancelled";

const GREEN = "#00A651";
const TEXT = "#17221c";
const MUTED = "#737b76";
const BORDER = "#e4ebe6";

const ui: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8faf9",
    padding: "28px 0 64px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  title: {
    margin: 0,
    color: TEXT,
    fontSize: 32,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "5px 0 0",
    color: MUTED,
    fontSize: 13,
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
    marginBottom: 22,
  },
  tabs: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
    background: "#ebeeec",
    borderRadius: 30,
    padding: 4,
  },
  tabButton: {
    border: 0,
    background: "transparent",
    color: "#1f2622",
    borderRadius: 24,
    padding: "10px 24px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  tabButtonActive: {
    background: "#050505",
    color: "#fff",
  },
  patientSelect: {
    minWidth: 160,
    height: 42,
    border: `1px solid ${GREEN}`,
    borderRadius: 22,
    background: "#fff",
    color: TEXT,
    padding: "0 16px",
    fontSize: 12,
    fontWeight: 600,
    outline: 0,
  },
  orderCard: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 22,
    boxShadow: "0 4px 18px rgba(20, 40, 30, 0.035)",
  },
  hero: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "stretch",
    margin: 18,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #d9eee1",
  },
  heroLeft: {
    flex: "1 1 620px",
    minWidth: 0,
    padding: "22px 24px 18px",
    background:
      "linear-gradient(115deg, #effbf4 0%, #f8fffb 58%, #eefaf3 100%)",
  },
  heroRight: {
    flex: "0 1 360px",
    minWidth: 280,
    padding: "20px 22px",
    color: "#fff",
    background:
      "radial-gradient(circle at 85% 18%, rgba(255,255,255,.09), transparent 28%), linear-gradient(135deg, #087b42 0%, #046534 100%)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 11px",
    borderRadius: 16,
    fontSize: 10,
    fontWeight: 800,
    lineHeight: 1,
  },
  orderId: {
    fontSize: 12,
    color: "#27352d",
  },
  heroTitle: {
    margin: "10px 0 8px",
    color: "#101713",
    fontSize: 25,
    fontWeight: 800,
    lineHeight: 1.15,
  },
  addressLine: {
    margin: 0,
    display: "flex",
    gap: 7,
    alignItems: "flex-start",
    color: "#38443d",
    fontSize: 12,
  },
  timeline: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: 22,
    overflowX: "auto",
    paddingBottom: 2,
  },
  step: {
    minWidth: 118,
    flex: "1 0 118px",
    position: "relative",
    textAlign: "left",
  },
  stepTop: {
    display: "flex",
    alignItems: "center",
  },
  stepCircle: {
    position: "relative",
    zIndex: 2,
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  stepLine: {
    height: 2,
    flex: 1,
    marginRight: 4,
  },
  stepTitle: {
    display: "block",
    marginTop: 7,
    paddingRight: 8,
    color: "#27322c",
    fontSize: 10,
    fontWeight: 700,
  },
  stepMeta: {
    display: "block",
    marginTop: 2,
    color: "#87908a",
    fontSize: 9,
  },
  phleboTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    paddingBottom: 16,
    borderBottom: "1px solid rgba(255,255,255,.22)",
  },
  phleboName: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
  },
  assigned: {
    display: "inline-flex",
    marginLeft: 8,
    padding: "4px 8px",
    borderRadius: 10,
    background: "rgba(255,255,255,.15)",
    fontSize: 9,
    fontWeight: 700,
  },
  trackRoundButton: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,.35)",
    background: "rgba(255,255,255,.14)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentBlock: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 18,
  },
  paymentLabel: {
    display: "block",
    color: "rgba(255,255,255,.78)",
    fontSize: 10,
  },
  paymentAmount: {
    display: "block",
    marginTop: 2,
    fontSize: 24,
    fontWeight: 800,
  },
  heroAction: {
    border: "1px solid rgba(255,255,255,.75)",
    borderRadius: 22,
    background: "transparent",
    color: "#fff",
    padding: "9px 14px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    textDecoration: "none",
  },
  patientRow: {
    margin: "0 18px 16px",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    overflow: "hidden",
  },
  patientTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    padding: "14px 16px",
  },
  patientIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    minWidth: 0,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#fff7d9",
    color: "#9a7a14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  },
  patientName: {
    margin: 0,
    color: TEXT,
    fontSize: 14,
    fontWeight: 800,
  },
  patientMeta: {
    margin: "3px 0 0",
    color: MUTED,
    fontSize: 10,
  },
  genderPill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: 12,
    background: "#22b76d",
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    marginLeft: 8,
  },
  patientStatus: {
    padding: "6px 11px",
    borderRadius: 15,
    fontSize: 9,
    fontWeight: 800,
  },
  testsSection: {
    padding: "14px 16px 16px",
    borderTop: `1px solid ${BORDER}`,
  },
  testHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  testLabel: {
    color: "#2c352f",
    fontSize: 11,
    fontWeight: 700,
  },
  parameterPill: {
    padding: "5px 9px",
    borderRadius: 12,
    background: "#e6f8ee",
    color: GREEN,
    fontSize: 9,
    fontWeight: 700,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
  },
  chip: {
    border: "1px solid #bfc9c3",
    background: "#fff",
    color: "#222a25",
    borderRadius: 16,
    padding: "6px 10px",
    fontSize: 9,
    fontWeight: 600,
  },
  attachmentArea: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  attachmentThumb: {
    width: 42,
    height: 42,
    objectFit: "cover",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
  },
  details: {
    margin: "0 18px 16px",
    borderTop: `1px solid ${BORDER}`,
  },
  detailsSummary: {
    cursor: "pointer",
    padding: "13px 0 0",
    color: GREEN,
    fontSize: 11,
    fontWeight: 700,
  },
  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 10,
    paddingTop: 12,
  },
  paymentCell: {
    padding: "10px 12px",
    borderRadius: 10,
    background: "#f7faf8",
  },
  empty: {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    padding: "64px 20px",
    textAlign: "center",
  },
};

function formatMoney(amount: number | null | undefined) {
  return `₹${Number(amount ?? 0).toFixed(2)}`;
}

function formatOrderDate(date: string | null | undefined) {
  if (!date) return "N/A";

  const value = new Date(`${date}T00:00:00`);
  if (Number.isNaN(value.getTime())) return date;

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getGender(gender: number | null | undefined) {
  switch (Number(gender)) {
    case 1:
      return "Male";
    case 2:
      return "Female";
    case 3:
      return "Other";
    default:
      return "N/A";
  }
}

function getAge(dob: string | null | undefined) {
  if (!dob) return null;

  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function getInitials(name: string | null | undefined) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "PT";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getAttachmentUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL?.trim().replace(
    /\/+$/,
    "",
  );

  if (!baseUrl) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  return `${baseUrl}/${path.replace(/^\/+/, "")}`;
}

function getBookingLocation(order: OrderItem) {
  const address = order.addressDetails;
  if (!address) return null;

  const apiLat = Number(address.latitude);
  const apiLng = Number(address.longitude);

  // Temporary India/Kolkata fallback until backend coordinates are corrected.
  const defaultBookingLat = 22.5726;
  const defaultBookingLng = 88.3639;

  const isIndiaLocation =
    Number.isFinite(apiLat) &&
    Number.isFinite(apiLng) &&
    apiLat >= 6 &&
    apiLat <= 38 &&
    apiLng >= 68 &&
    apiLng <= 98;

  return {
    lat: isIndiaLocation ? apiLat : defaultBookingLat,
    lng: isIndiaLocation ? apiLng : defaultBookingLng,
    address,
  };
}

function getPhleboLocation(order: OrderItem) {
  const apiLat = Number(order.phlebo_lat);
  const apiLng = Number(order.phlebo_long);

  const isValidIndiaLocation =
    Number.isFinite(apiLat) &&
    Number.isFinite(apiLng) &&
    apiLat >= 6 &&
    apiLat <= 38 &&
    apiLng >= 68 &&
    apiLng <= 98;

  if (isValidIndiaLocation) {
    return {
      lat: apiLat,
      lng: apiLng,
      isLive: true,
    };
  }

  const booking = getBookingLocation(order);

  if (booking) {
    return {
      lat: booking.lat + 0.018,
      lng: booking.lng + 0.012,
      isLive: false,
    };
  }

  return {
    lat: 22.5906,
    lng: 88.3759,
    isLive: false,
  };
}

function isCancelledOrder(order: OrderItem) {
  return String(order.bookingStatus ?? "")
    .toLowerCase()
    .includes("cancel");
}

function isCompletedOrder(order: OrderItem) {
  const status = String(order.bookingStatus ?? "").toLowerCase();

  return (
    order.reportStatus === "1" ||
    status.includes("complete") ||
    status.includes("report ready") ||
    status.includes("completed")
  );
}

function getOrderStage(order: OrderItem) {
  if (isCancelledOrder(order)) return -1;

  const status = String(order.bookingStatus ?? "").toLowerCase();

  if (isCompletedOrder(order)) return 4;
  if (status.includes("processing") || status.includes("lab")) return 3;
  if (status.includes("collect")) return 2;
  if (status.includes("assign") || status.includes("phlebo")) return 1;

  return 0;
}

function getOrderHeadline(order: OrderItem) {
  if (isCancelledOrder(order)) return "Your Booking was Cancelled";

  switch (getOrderStage(order)) {
    case 4:
      return "Your Report is Ready";
    case 3:
      return "Your Sample is at the Lab";
    case 2:
      return "Your Sample has been Collected";
    case 1:
      return "Phlebotomist is on the Way";
    default:
      return "Your Booking is Confirmed";
  }
}

function getOrderBadge(order: OrderItem) {
  if (isCancelledOrder(order)) {
    return { label: "Cancelled", background: "#fff0f0", color: "#d43838" };
  }

  if (isCompletedOrder(order)) {
    return { label: "Completed", background: "#e8f5ff", color: "#1076a8" };
  }

  if (getOrderStage(order) >= 2) {
    return { label: "On Track", background: "#e2f8ec", color: "#008d46" };
  }

  return {
    label: order.bookingStatus || "Booked",
    background: "#fff4d5",
    color: "#8a6700",
  };
}

function getPatientStatus(order: OrderItem) {
  if (isCancelledOrder(order)) {
    return { label: "Cancelled", background: "#fff0f0", color: "#cf3838" };
  }

  if (order.reportStatus === "1" || isCompletedOrder(order)) {
    return { label: "Report Ready", background: "#0879b8", color: "#fff" };
  }

  if (getOrderStage(order) >= 3) {
    return {
      label: "On Lab Processing",
      background: "#ffd538",
      color: "#4b3d00",
    };
  }

  return { label: "Booked", background: "#e8f8ef", color: GREEN };
}

function getFullAddress(order: OrderItem) {
  const address = order.addressDetails;
  if (!address) return "Booking address not available";

  return [
    address.addressLine_1,
    address.addressLine_2,
    address.landMark,
    address.pinCode,
  ]
    .filter(Boolean)
    .join(", ");
}

const timelineSteps = [
  "Order Booked",
  "Phlebotomist Assigned",
  "Sample Collected",
  "Sample Processing",
  "Report Ready",
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [selectedPatientId, setSelectedPatientId] = useState("all");
  const [trackingOrder, setTrackingOrder] = useState<OrderItem | null>(null);
  const [mounted, setMounted] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders();

      if (response?.status === 1 && Array.isArray(response.data)) {
        setOrders(response.data);
        setTotalOrders(Number(response.totalOrders ?? response.data.length));
      } else {
        setOrders([]);
        setTotalOrders(0);
      }
    } catch (err) {
      console.error("My Orders Error:", err);
      setOrders([]);
      setError(
        err instanceof Error ? err.message : "Unable to load your orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    void loadOrders();
  }, []);

  const patients = useMemo(() => {
    const patientMap = new Map<number, string>();

    orders.forEach((order) => {
      order.patientWiseBookingDetails.forEach((group) => {
        patientMap.set(group.patientId, group.patient.patient_name);
      });
    });

    return Array.from(patientMap.entries()).map(([id, name]) => ({ id, name }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (selectedPatientId !== "all") {
        const patientId = Number(selectedPatientId);
        const hasPatient = order.patientWiseBookingDetails.some(
          (group) => group.patientId === patientId,
        );

        if (!hasPatient) return false;
      }

      if (activeTab === "cancelled") return isCancelledOrder(order);
      if (activeTab === "completed") return isCompletedOrder(order);
      if (activeTab === "active") {
        return !isCancelledOrder(order) && !isCompletedOrder(order);
      }

      return true;
    });
  }, [orders, activeTab, selectedPatientId]);

  const trackingModal =
    mounted && trackingOrder
      ? createPortal(
        (() => {
          const phlebo = getPhleboLocation(trackingOrder);
          const booking = getBookingLocation(trackingOrder);

          return (
            <div
              onClick={() => setTrackingOrder(null)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 999999,
                background: "rgba(0,0,0,.58)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 18,
              }}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                style={{
                  width: "min(900px, 96vw)",
                  maxHeight: "92vh",
                  overflowY: "auto",
                  background: "#fff",
                  borderRadius: 18,
                  overflowX: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "16px 20px",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: TEXT,
                        fontSize: 20,
                        fontWeight: 800,
                      }}
                    >
                      Track Phlebotomist
                    </h3>
                    <p
                      style={{
                        margin: "3px 0 0",
                        color: MUTED,
                        fontSize: 11,
                      }}
                    >
                      Booking:{" "}
                      {trackingOrder.displayBookingNumber ||
                        `#${trackingOrder.id}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTrackingOrder(null)}
                    aria-label="Close map"
                    style={{
                      width: 38,
                      height: 38,
                      border: 0,
                      borderRadius: "50%",
                      background: "#f1f4f2",
                      color: "#111",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>

                <div
                  style={{
                    padding: "13px 20px",
                    background: "#f6fbf8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "#e8f8ef",
                        color: GREEN,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa-solid fa-motorcycle" />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: 12 }}>
                        Phlebotomist
                      </strong>
                      <small style={{ color: GREEN, fontWeight: 700 }}>
                        {phlebo.isLive ? "Live location" : "On the way"}
                      </small>
                    </div>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      maxWidth: 210,
                      height: 2,
                      background: "#a9dcbc",
                    }}
                  />

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: "#e8f8ef",
                        color: GREEN,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa-solid fa-house" />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: 12 }}>
                        Booking Address
                      </strong>
                      <small style={{ color: MUTED }}>Destination</small>
                    </div>
                  </div>
                </div>

                {booking ? (
                  <PhleboTrackingMap
                    phleboLat={phlebo.lat}
                    phleboLng={phlebo.lng}
                    bookingLat={booking.lat}
                    bookingLng={booking.lng}
                  />
                ) : (
                  <div style={{ padding: 48, textAlign: "center" }}>
                    Booking location unavailable.
                  </div>
                )}

                {booking && (
                  <div
                    style={{
                      display: "flex",
                      gap: 11,
                      alignItems: "flex-start",
                      padding: "14px 20px",
                      borderTop: `1px solid ${BORDER}`,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "#e9f8ef",
                        color: GREEN,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-house" />
                    </div>

                    <div>
                      <strong style={{ display: "block", fontSize: 12 }}>
                        {booking.address.addressName}
                      </strong>
                      <p
                        style={{
                          margin: "3px 0",
                          color: MUTED,
                          fontSize: 11,
                        }}
                      >
                        {getFullAddress(trackingOrder)}
                      </p>
                      <small style={{ color: MUTED }}>
                        {booking.address.fullName}
                        {booking.address.contactNumber
                          ? ` • ${booking.address.contactNumber}`
                          : ""}
                      </small>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    padding: "14px 20px",
                    borderTop: `1px solid ${BORDER}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <span
                      style={{ display: "block", color: MUTED, fontSize: 10 }}
                    >
                      Phlebotomist Location
                    </span>
                    <strong style={{ fontSize: 12 }}>
                      {phlebo.lat.toFixed(6)}, {phlebo.lng.toFixed(6)}
                    </strong>
                  </div>

                  {booking && (
                    <a
                      href={
                        `https://www.google.com/maps/dir/?api=1` +
                        `&origin=${phlebo.lat},${phlebo.lng}` +
                        `&destination=${booking.lat},${booking.lng}` +
                        `&travelmode=driving`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "11px 18px",
                        borderRadius: 24,
                        background: GREEN,
                        color: "#fff",
                        textDecoration: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        boxShadow: "0 5px 14px rgba(0,166,81,.2)",
                      }}
                    >
                      Open Route in Google Maps
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })(),
        document.body,
      )
      : null;

  if (loading) {
    return (
      <section style={ui.page}>
        <div className="container">
          <div style={{ ...ui.empty, color: MUTED }}>
            <i
              className="fa-solid fa-spinner fa-spin"
              style={{ color: GREEN, fontSize: 28 }}
            />
            <p style={{ marginTop: 12 }}>Loading your orders...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="my-order">
        <div className="container">
          <div className="breadcrumb-wrap">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  My Order
                </li>
              </ol>
            </nav>
          </div>

          <div className="order-title">
            <h2>My Orders</h2>
            <p>Manage and track all orders</p>
          </div>

          <div className="filter-bar">
            <div className="tabs">
              {(
                [
                  ["all", "All Orders"],
                  ["active", "Active Tracking"],
                  ["completed", "Completed & Reports"],
                  ["cancelled", "Cancelled"],
                ] as Array<[OrderTab, string]>
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`tab-button ${activeTab === key ? 'active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              value={selectedPatientId}
              onChange={(event) => setSelectedPatientId(event.target.value)}
              // style={ui.patientSelect}
              className="form-control form-select"
              aria-label="Filter orders by patient"
            >
              <option value="all">All Patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div style={ui.empty}>
              <i
                className="fa-solid fa-circle-exclamation"
                style={{ color: "#db4040", fontSize: 28 }}
              />
              <h3 style={{ margin: "12px 0 5px", color: TEXT }}>
                Unable to load orders
              </h3>
              <p style={{ color: MUTED }}>{error}</p>
              <button
                type="button"
                className="cmn_btn"
                onClick={() => void loadOrders()}
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={ui.empty}>
              <i
                className="fa-solid fa-box-open"
                style={{ color: GREEN, fontSize: 30 }}
              />
              <h3 style={{ margin: "12px 0 5px", color: TEXT }}>
                No orders found
              </h3>
              <p style={{ color: MUTED, margin: 0 }}>
                No orders match the selected filter.
              </p>
            </div>
          ) : (
            <div className="order-main">
              {filteredOrders.map((order) => {
                const stage = getOrderStage(order);
                const badge = getOrderBadge(order);
                const patientStatus = getPatientStatus(order);
                const phlebo = getPhleboLocation(order);
                const isPaid = order.paymentStatus === "1";

                return (
                  <article key={order.id} className="order-card">
                    <div className="hero">
                      <div className="hero-left">
                        <div className="hero-head">
                          <span className="on-track">On Track</span>
                          <span className="order-id">
                            Order ID: {order.displayBookingNumber || `#${order.id}`}
                          </span>
                        </div>
                        <h2 className="hero-title">{getOrderHeadline(order)}</h2>
                        <p className="address-line">
                          <i className="fa-solid fa-location-dot address-icon" />
                          <span>{getFullAddress(order)}</span>
                        </p>

                        <div className="timeline">
                          {timelineSteps.map((stepName, index) => {
                            const completed = stage >= index;
                            const current = stage === index;
                            const cancelled = stage === -1;

                            const circleClass = [
                              "step-circle",
                              completed && !cancelled && "step-circle--completed",
                              current && "step-circle--current",
                            ]
                              .filter(Boolean)
                              .join(" ");

                            const lineClass = [
                              "step-line",
                              stage > index && !cancelled && "step-line--completed",
                            ]
                              .filter(Boolean)
                              .join(" ");

                            const metaClass = ["step-meta", current && "step-meta--current"]
                              .filter(Boolean)
                              .join(" ");

                            return (
                              <div key={stepName} className="step">
                                <div className="step-top">
                                  <span className={circleClass}>
                                    <i className="fa-solid fa-check" />
                                  </span>

                                  {index < timelineSteps.length - 1 && (
                                    <span className={lineClass} />
                                  )}
                                </div>

                                <span className="step-title">{stepName}</span>
                                <span className={metaClass}>
                                  {cancelled
                                    ? "Cancelled"
                                    : stage > index
                                      ? "Completed"
                                      : current
                                        ? "Current"
                                        : "Pending"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <aside className="hero-right">
                        <div className="phlebo-top">
                          <div className="left">
                            <div className="phlebo-header">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <h3 className="phlebo-name">Saikat Ray</h3>
                                <span className="assigned">
                                  {phlebo.isLive ? "Live" : "Tracking"}
                                </span>
                              </div>
                            </div>
                            <p className="phlebo-subtitle">
                              {stage >= 2
                                ? "Collection progress available"
                                : "Track sample collection"}
                            </p>
                          </div>
                          <div className="d-flex gap-3">
                            <Link href="tel:+917001140151" className="call-btn"><i className="fa-solid fa-phone"></i></Link>
                            <button
                              type="button"
                              title="Track phlebotomist"
                              aria-label="Track phlebotomist"
                              className="track-round-button"
                              onClick={() => setTrackingOrder(order)}
                            >
                              <i className="fa-solid fa-location-crosshairs" />
                            </button>
                          </div>
                        </div>

                        <div className="payment-block d-flex flex-wrap justify-content-between">
                          <div className="pay-left">
                            <p className="payment-label mb-2">Payment Summary</p>
                            <div className="d-flex gap-1">
                              <h3 className="payment-amount">
                                {formatMoney(order.total_amount)}
                                <span className="payment-status-text">
                                  {isPaid ? "Paid" : "Payment Pending"}
                                </span>
                              </h3>

                            </div>
                          </div>

                          <button
                            type="button"
                            className="exp-btn is-white"
                          // onClick={() => setTrackingOrder(order)}
                          >
                            Download Invoice
                            <i className="fa-solid fa-download"></i>
                          </button>
                        </div>
                      </aside>
                    </div>

                    {order.patientWiseBookingDetails.map((patientGroup) => {
                      const patient = patientGroup.patient;
                      const age = getAge(patient.dob);
                      const visibleTests = patientGroup.bookingDetails.slice(0, 5);
                      const remainingTests = Math.max(
                        0,
                        patientGroup.bookingDetails.length - visibleTests.length,
                      );
                      const firstBooking = patientGroup.bookingDetails[0];

                      return (
                        <div key={patientGroup.patientId} className="patient-row">
                          <div className="patient-top">
                            <div className="patient-identity">
                              <div className="avatar">
                                <h4>{getInitials(patient.patient_name)}</h4>
                              </div>

                              <div className="patient-info">
                                <div className="patient-name-row d-flex align-items-center gap-2 mb-2">
                                  <h4 className="patient-name">{patient.patient_name}</h4>
                                  <span className="gender-pill">
                                    {getGender(patient.gender)}
                                    {age !== null ? `, ${age} yrs` : ""}
                                  </span>
                                </div>

                                <p className="patient-meta">
                                  Investigation ID: INV-
                                  {firstBooking?.id ?? patientGroup.patientId}
                                </p>
                              </div>
                            </div>

                            {/* <span
                              className={`patient-status patient-status--${patientStatus.label.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {patientStatus.label}
                            </span> */}
                            <div className="card-action d-flex align-items-center gap-1">
                              <span className={`order-status ${badge.label.toLowerCase().replace(/\s+/g, "-")}`}>
                                {badge.label}
                              </span>
                              <div className={`act-bar ${isActionOpen ? "active" : ""}`}>
                                <button type="button" onClick={() => setIsActionOpen(!isActionOpen)}>
                                  <i className="fa-solid fa-ellipsis-vertical"></i>
                                </button>

                                <div className="act-content">
                                  <ul>
                                    <li>Download Report</li>
                                    <li>Download Invoice</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="tests-section">
                            <div className="test-header">
                              <h6 className="test-label">Includes Investigation Tests</h6>
                              <span className="parameter-pill">
                                {patientGroup.bookingDetails.length} Parameters
                                {patientGroup.bookingDetails.length === 1 ? "" : "s"}
                              </span>
                            </div>

                            <div className="chips">
                              {visibleTests.map((detail) => (
                                <span key={detail.id} className="chip">
                                  {detail.testDetails?.test_name ||
                                    `${detail.productType === "package" ? "Package" : "Test"} #${detail.test_id}`}
                                </span>
                              ))}

                              {remainingTests > 0 && (
                                <span className="chip chip--more">
                                  +{remainingTests} More
                                </span>
                              )}
                            </div>

                            {patientGroup.attachments?.length > 0 && (
                              <div className="attachment-area">
                                <span className="attachment-label">Prescription:</span>

                                {patientGroup.attachments.slice(0, 3).map((attachment) => {
                                  const fileUrl = getAttachmentUrl(attachment.attechment);
                                  const isPdf = attachment.attechment
                                    .toLowerCase()
                                    .endsWith(".pdf");

                                  return (
                                    <a style={{marginTop:500}}
                                      key={attachment.id}
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="View prescription"
                                      className="attachment-link"
                                    >
                                      {isPdf ? (
                                        <span className="attachment-thumb attachment-thumb--pdf">
                                          <i className="fa-solid fa-file-pdf" />
                                        </span>
                                      ) : (
                                          <img
                                            style={{height:100, width:200}}
                                          src={fileUrl}
                                          alt="Prescription"
                                          className="attachment-thumb"
                                        />
                                      )}
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <details className="details">
                      <summary className="details-summary">View Payment Details</summary>

                      <div className="payment-grid">
                        {[
                          ["Gross Amount", formatMoney(order.gross_amount)],
                          ["Offer Discount", `-${formatMoney(order.offer_discount)}`],
                          ["Coupon Discount", `-${formatMoney(order.coupon_discount)}`],
                          ["Paid Amount", formatMoney(order.total_amount)],
                          ["Payment Type", order.payment_type || "N/A"],
                          ["Transaction ID", order.transaction_id || "N/A"],
                        ].map(([label, value]) => (
                          <div key={label} className="payment-cell">
                            <span className="payment-cell-label">{label}</span>
                            <strong
                              className={`payment-cell-value ${label === "Paid Amount" ? "payment-cell-value--paid" : ""}`}
                            >
                              {value}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </details>
                  </article>
                );
              })}
              <div className="d-flex justify-content-end gap-3">
                <button className="sec_btn border-0">Reschedule Test</button>
                <button className="cmn_btn">Re-Book Test</button>
              </div>
            </div>

          )}
        </div>
      </section>

      {trackingModal}
    </>
  );
}
