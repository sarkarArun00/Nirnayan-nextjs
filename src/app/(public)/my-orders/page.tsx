"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./page.module.css";
import { createPortal } from "react-dom";
import { getAllOrders, type OrderItem } from "@/services/order.service";
import PhleboTrackingMap from "@/components/orders/PhleboTrackingMap";

function formatMoney(amount: number | null | undefined) {
  return `₹${Number(amount ?? 0).toFixed(2)}`;
}

function formatOrderDate(date: string | null | undefined) {
  if (!date) {
    return "N/A";
  }

  const value = new Date(`${date}T00:00:00`);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getGender(gender: number | null) {
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

function getTotalItems(order: OrderItem) {
  return order.patientWiseBookingDetails.reduce(
    (total, patient) => total + patient.bookingDetails.length,
    0,
  );
}

function getTestCount(order: OrderItem) {
  return order.patientWiseBookingDetails.reduce(
    (total, patient) =>
      total +
      patient.bookingDetails.filter((item) => item.productType === "test")
        .length,
    0,
  );
}

function getPackageCount(order: OrderItem) {
  return order.patientWiseBookingDetails.reduce(
    (total, patient) =>
      total +
      patient.bookingDetails.filter((item) => item.productType === "package")
        .length,
    0,
  );
}

  function getAttachmentUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL?.trim().replace(
      /\/+$/,
      "",
    );

    if (!baseUrl) {
      return path;
    }

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${baseUrl}/${path.replace(/^\/+/, "")}`;
  }

export default function MyOrdersPage() {

  const [totalOrders, setTotalOrders] = useState(0);

  const [loading, setLoading] = useState(true);


    const [orders, setOrders] = useState<OrderItem[]>([]);

  const [error, setError] = useState("");

  const [trackingOrder, setTrackingOrder] = useState<OrderItem | null>(null);

  const [mounted, setMounted] = useState(false);


  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders();

      console.log("My Orders:", response);

      if (response?.status === 1 && Array.isArray(response.data)) {
        setOrders(response.data);

        setTotalOrders(Number(response.totalOrders ?? response.data.length));
      } else {
        setOrders([]);
        setTotalOrders(0);
      }
    } catch (error) {
      console.error("My Orders Error:", error);

      setOrders([]);

      setError(
        error instanceof Error ? error.message : "Unable to load your orders.",
      );
    } finally {
      setLoading(false);
    }
  };


function getBookingLocation(order: OrderItem) {
  const address = order.addressDetails;

  if (!address) {
    return null;
  }

  const apiLat = Number(address.latitude);
  const apiLng = Number(address.longitude);

  /*
   * TEMPORARY INDIA FALLBACK
   * Remove this once backend sends correct
   * booking address coordinates.
   */
  const DEFAULT_BOOKING_LAT = 22.5726;
  const DEFAULT_BOOKING_LNG = 88.3639;

  const isIndiaLocation =
    Number.isFinite(apiLat) &&
    Number.isFinite(apiLng) &&
    apiLat >= 6 &&
    apiLat <= 38 &&
    apiLng >= 68 &&
    apiLng <= 98;

  return {
    lat: isIndiaLocation ? apiLat : DEFAULT_BOOKING_LAT,

    lng: isIndiaLocation ? apiLng : DEFAULT_BOOKING_LNG,

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

  // Use real phlebo location later
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
      // Temporary phlebo position nearby
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

  useEffect(() => {
    setMounted(true);
  }, []);
  

  const getMapUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  };

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  if (loading) {
    return (
      <section className={styles.ordersPage}>
        <div className="container">
          <div className={styles.loading}>
            <i className="fa-solid fa-spinner fa-spin" />

            <p>Loading your orders...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.ordersPage}>
      <div className="container">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>

          <li className="breadcrumb-item active">My Orders</li>
        </ol>

        <div className={styles.pageHeader}>
          <div>
            <h1>My Orders</h1>

            <p>
              Track and review your diagnostic test and health package bookings.
            </p>
          </div>

          <div className={styles.totalBadge}>
            <span>Total Orders</span>

            <strong>{totalOrders}</strong>
          </div>
        </div>

        {error ? (
          <div className={styles.errorBox}>
            <i className="fa-solid fa-circle-exclamation" />

            <h4>Unable to load orders</h4>

            <p>{error}</p>

            <button
              type="button"
              className="cmn_btn"
              onClick={() => void loadOrders()}
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyOrders}>
            <i className="fa-solid fa-box-open" />

            <h3>No Orders Yet</h3>

            <p>You haven't placed any diagnostic bookings yet.</p>

            <Link href="/" className="cmn_btn">
              Book A Test
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => {
              const itemCount = getTotalItems(order);

              const testCount = getTestCount(order);

              const packageCount = getPackageCount(order);
              const phleboLocation = getPhleboLocation(order);

              const isPaid = order.paymentStatus === "1";

              return (
                <article key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <div className={styles.orderNumberRow}>
                        <h3>
                          {order.displayBookingNumber || `Order #${order.id}`}
                        </h3>

                        <span className={styles.statusBadge}>
                          {order.bookingStatus}
                        </span>
                      </div>

                      <p className={styles.orderDate}>
                        <i className="fa-regular fa-calendar" />
                        Collection Date:{" "}
                        <strong>{formatOrderDate(order.slot_date)}</strong>
                      </p>
                    </div>

                    <div className={styles.amountBox}>
                      <span>Total Amount</span>

                      <strong>{formatMoney(order.total_amount)}</strong>

                      <small className={isPaid ? styles.paid : styles.unpaid}>
                        {isPaid ? "Paid" : "Payment Pending"}
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTrackingOrder(order);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#008F46";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#00A651";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                      style={{
                        border: "none",
                        background: "#00A651",
                        color: "#fff",
                        padding: "10px 16px",
                        borderRadius: "10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "9px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 5px 14px rgba(0, 166, 81, 0.20)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.18)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="fa-solid fa-location-dot" />
                      </span>

                      <span>Track Phlebotomist</span>

                      <i
                        className="fa-solid fa-chevron-right"
                        style={{ fontSize: "10px" }}
                      />
                    </button>
                    {/* <button
                      type="button"
                      className={styles.trackButton}
                      disabled={!phleboLocation}
                      onClick={() => {
                        if (!phleboLocation) {
                          return;
                        }

                        setTrackingOrder(order);
                      }}
                    >
                      <i className="fa-solid fa-location-dot" />

                      {phleboLocation
                        ? "Track Phlebotomist"
                        : "Location Not Available"}
                    </button> */}
                  </div>

                  <div className={styles.orderMeta}>
                    <div>
                      <i className="fa-solid fa-user-group" />

                      <span>
                        {order.patientWiseBookingDetails.length} Patient(s)
                      </span>
                    </div>

                    <div>
                      <i className="fa-solid fa-flask-vial" />

                      <span>{itemCount} Item(s)</span>
                    </div>

                    <div>
                      <i className="fa-solid fa-vial" />

                      <span>{testCount} Test(s)</span>
                    </div>

                    <div>
                      <i className="fa-solid fa-box-medical" />

                      <span>{packageCount} Package(s)</span>
                    </div>
                  </div>

                  <div className={styles.patientList}>
                    {order.patientWiseBookingDetails.map((patientGroup) => {
                      const doctorName = patientGroup.bookingDetails.find(
                        (detail) => detail.doctor_name,
                      )?.doctor_name;

                      return (
                        <div
                          key={patientGroup.patientId}
                          className={styles.patientCard}
                        >
                          <div className={styles.patientInfo}>
                            <div className={styles.avatar}>
                              <i className="fa-solid fa-user" />
                            </div>

                            <div>
                              <h4>{patientGroup.patient.patient_name}</h4>

                              <p>
                                {getGender(patientGroup.patient.gender)}

                                {patientGroup.patient.phoneNumber &&
                                  ` • ${patientGroup.patient.phoneNumber}`}
                              </p>

                              {doctorName && (
                                <p className={styles.doctor}>
                                  <i className="fa-solid fa-user-doctor" />
                                  Dr. {doctorName}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className={styles.patientItems}>
                            {patientGroup.bookingDetails.map((detail) => {
                              const test = detail.testDetails;

                              return (
                                <div
                                  key={detail.id}
                                  className={styles.testItem}
                                >
                                  <div className={styles.testIcon}>
                                    <i className="fa-solid fa-flask-vial" />
                                  </div>

                                  <div className={styles.testInfo}>
                                    <h5>
                                      {test?.test_name ||
                                        `Test #${detail.test_id}`}
                                    </h5>

                                    <div className={styles.testMeta}>
                                      {test?.test_code && (
                                        <span>Code: {test.test_code}</span>
                                      )}

                                      <span>
                                        {detail.productType === "package"
                                          ? "Health Package"
                                          : "Lab Test"}
                                      </span>

                                      {test?.tat?.normalTat && (
                                        <span>
                                          TAT: {test.tat.normalTat.value}{" "}
                                          {test.tat.normalTat.isHour
                                            ? "Hour(s)"
                                            : "Day(s)"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {patientGroup.attachments?.length > 0 && (
                            <div
                              className={styles.attachmentSection}
                              style={{
                                height: "80px",
                                width: "80px",
                                marginRight: "40px",
                              }}
                            >
                              <h5 style={{ fontSize: 12 }}>
                                <i className="fa-solid fa-paperclip" />
                                Prescription
                              </h5>

                              <div className={styles.attachmentList}>
                                {patientGroup.attachments.map((attachment) => {
                                  const fileUrl = getAttachmentUrl(
                                    attachment.attechment,
                                  );

                                  const isPdf = attachment.attechment
                                    .toLowerCase()
                                    .endsWith(".pdf");

                                  return (
                                    <a
                                      key={attachment.id}
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles.attachmentCard}
                                    >
                                      {isPdf ? (
                                        <div className={styles.fileIcon}>
                                          <i className="fa-solid fa-file-pdf" />
                                        </div>
                                      ) : (
                                        <img
                                          style={{
                                            height: "50px",
                                            width: "50px",
                                          }}
                                          src={fileUrl}
                                          alt="Prescription"
                                          className={styles.attachmentImage}
                                        />
                                      )}

                                      {/* <div style={{ fontSize: 12 }}>
                                        <strong>
                                          {isPdf
                                            ? "Prescription PDF"
                                            : "Prescription Image"}
                                        </strong>

                                        <span>View Attachment</span>
                                      </div>

                                      <i className="fa-solid fa-arrow-up-right-from-square" /> */}
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <details className={styles.details}>
                    <summary>
                      View Payment Details
                      <i className="fa-solid fa-chevron-down" />
                    </summary>

                    <div className={styles.paymentDetails}>
                      <div>
                        <span>Gross Amount</span>

                        <strong>{formatMoney(order.gross_amount)}</strong>
                      </div>

                      <div>
                        <span>Offer Discount</span>

                        <strong>-{formatMoney(order.offer_discount)}</strong>
                      </div>

                      <div>
                        <span>Coupon Discount</span>

                        <strong>-{formatMoney(order.coupon_discount)}</strong>
                      </div>

                      {order.coupon_id && (
                        <div>
                          <span>Coupon ID</span>

                          <strong>#{order.coupon_id}</strong>
                        </div>
                      )}

                      <div>
                        <span>Paid Amount</span>

                        <strong className={styles.greenAmount}>
                          {formatMoney(order.total_amount)}
                        </strong>
                      </div>

                      <div>
                        <span>Payment Type</span>

                        <strong>{order.payment_type || "N/A"}</strong>
                      </div>

                      <div>
                        <span>Transaction ID</span>

                        <strong className={styles.transactionId}>
                          {order.transaction_id || "N/A"}
                        </strong>
                      </div>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Map Modal  */}
      {trackingOrder &&
        (() => {
          const phlebo = getPhleboLocation(trackingOrder);

          const booking = getBookingLocation(trackingOrder);

          return (
            <div
              className={styles.mapBackdrop}
              onClick={() => setTrackingOrder(null)}
            >
              <div
                className={styles.mapModal}
                onClick={(event) => event.stopPropagation()}
              >
                {/* HEADER */}
                <div className={styles.mapHeader}>
                  <div>
                    <h3>Track Phlebotomist</h3>

                    <p>
                      Booking:{" "}
                      {trackingOrder.displayBookingNumber ||
                        `#${trackingOrder.id}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={styles.mapClose}
                    onClick={() => setTrackingOrder(null)}
                    aria-label="Close map"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>

                {/* TRACKING STATUS */}
                <div
                  style={{
                    padding: "14px 20px",
                    background: "#f7fbf8",
                    borderBottom: "1px solid #e8ece9",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  {/* PHLEBOTOMIST */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",

                        borderRadius: "50%",

                        background: "#e8f8ef",

                        color: "#00A651",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-person-walking" />
                    </div>

                    <div>
                      <strong
                        style={{
                          display: "block",

                          fontSize: "13px",

                          color: "#1c2821",
                        }}
                      >
                        Phlebotomist
                      </strong>

                      <small
                        style={{
                          display: "block",

                          color: "#00A651",

                          marginTop: "2px",

                          fontWeight: 600,
                        }}
                      >
                        {phlebo.isLive ? "Live location" : "On the way"}
                      </small>
                    </div>
                  </div>

                  {/* ROUTE */}
                  <div
                    style={{
                      flex: 1,

                      display: "flex",
                      alignItems: "center",

                      maxWidth: "220px",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",

                        borderRadius: "50%",

                        background: "#00A651",

                        flexShrink: 0,
                      }}
                    />

                    <div
                      style={{
                        flex: 1,

                        height: "2px",

                        background: "#a9dcbc",

                        position: "relative",
                      }}
                    >
                      <i
                        className="fa-solid fa-chevron-right"
                        style={{
                          position: "absolute",

                          right: "-2px",

                          top: "50%",

                          transform: "translateY(-50%)",

                          color: "#00A651",

                          fontSize: "10px",
                        }}
                      />
                    </div>
                  </div>

                  {/* DESTINATION */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",

                        borderRadius: "10px",

                        background: "#e8f8ef",

                        color: "#00A651",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-house" />
                    </div>

                    <div>
                      <strong
                        style={{
                          display: "block",

                          fontSize: "13px",

                          color: "#1c2821",
                        }}
                      >
                        Booking Address
                      </strong>

                      <small
                        style={{
                          display: "block",

                          color: "#777",

                          marginTop: "2px",
                        }}
                      >
                        Destination
                      </small>
                    </div>
                  </div>
                </div>

                {/* MAP */}
                {booking ? (
                  <div className={styles.mapContainer}>
                    <PhleboTrackingMap
                      phleboLat={phlebo.lat}
                      phleboLng={phlebo.lng}
                      bookingLat={booking.lat}
                      bookingLng={booking.lng}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      minHeight: "350px",

                      display: "flex",
                      flexDirection: "column",

                      alignItems: "center",

                      justifyContent: "center",

                      textAlign: "center",

                      padding: "30px",
                    }}
                  >
                    <i
                      className="fa-solid fa-location-dot"
                      style={{
                        fontSize: "32px",

                        color: "#00A651",

                        marginBottom: "12px",
                      }}
                    />

                    <h5>Booking location unavailable</h5>

                    <p>
                      Latitude and longitude are not available for this booking.
                    </p>
                  </div>
                )}

                {/* BOOKING ADDRESS */}
                {booking && (
                  <div
                    style={{
                      padding: "15px 20px",

                      borderTop: "1px solid #e8ece9",

                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        alignItems: "flex-start",

                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",

                          height: "40px",

                          flexShrink: 0,

                          borderRadius: "10px",

                          background: "#e9f8ef",

                          color: "#00A651",

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "center",
                        }}
                      >
                        <i className="fa-solid fa-house" />
                      </div>

                      <div>
                        <strong
                          style={{
                            display: "block",

                            fontSize: "13px",

                            marginBottom: "3px",
                          }}
                        >
                          {booking.address.addressName}
                        </strong>

                        <p
                          style={{
                            margin: 0,

                            color: "#69716c",

                            fontSize: "12px",

                            lineHeight: 1.5,
                          }}
                        >
                          {[
                            booking.address.addressLine_1,

                            booking.address.addressLine_2,

                            booking.address.landMark,

                            booking.address.pinCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>

                        <small
                          style={{
                            display: "block",

                            marginTop: "4px",

                            color: "#777",
                          }}
                        >
                          {booking.address.fullName}

                          {booking.address.contactNumber
                            ? ` • ${booking.address.contactNumber}`
                            : ""}
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {/* FOOTER */}
                <div className={styles.mapFooter}>
                  <div>
                    <span>Phlebotomist Location</span>

                    <strong>
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
                      className="cmn_btn"
                    >
                      Open Route in Google Maps
                      <i className="fa-solid fa-arrow-up-right-from-square ms-2" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </section>
  );
}
