"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

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

const CART_KEY = "nirnayan_temp_cart";

export default function CartPage() {

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartGroup[]>([]);

const [removeTarget, setRemoveTarget] = useState<{
  patientId: number | string;
  item: CartItemRef;
} | null>(null);


  const updateCartStorage = (updatedCart: CartGroup[]) => {
    setCart(updatedCart);

    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };


  const handleRemoveItem = (patientId: number | string, item: CartItemRef) => {
    const patientGroup = cart.find(
      (group) => String(group.patientId) === String(patientId),
    );

    if (!patientGroup) {
      return;
    }

    if (patientGroup.items.length > 1) {
      const updatedCart = cart.map((group) => {
        if (String(group.patientId) !== String(patientId)) {
          return group;
        }

        return {
          ...group,

          items: group.items.filter(
            (cartItem) =>
              !(
                cartItem.id === item.id &&
                cartItem.productType === item.productType
              ),
          ),
        };
      });

      updateCartStorage(updatedCart);

      return;
    }

    setRemoveTarget({
      patientId,
      item,
    });
  };


const confirmRemoveLastItem = () => {
  if (!removeTarget) {
    return;
  }

  const updatedCart = cart.filter(
    (group) => String(group.patientId) !== String(removeTarget.patientId),
  );

  updateCartStorage(updatedCart);

  setRemoveTarget(null);
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

const getTotalItems = () => {
  return cart.reduce((total, group) => total + group.items.length, 0);
};

  if (loading) {
    return <div className="container py-5">Loading cart...</div>;
  }

  const removePatient = removeTarget
    ? cart.find(
        (group) => String(group.patientId) === String(removeTarget.patientId),
      )
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
        <div
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
            Your Cart
          </h1>

          <p
            style={{
              margin: 0,
              color: "#777",
            }}
          >
            Review tests and packages selected for each patient.
          </p>
        </div>

        {cart.length === 0 ? (
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
              {cart.map((group) => (
                <div key={group.patientId} className={styles.patientCart}>
                  <div className={styles.patientHeader}>
                    <div>
                      <h3>Patient #{group.patientId}</h3>

                      <p>
                        {group.items.length}{" "}
                        {group.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {group.items.map((item) => (
                    <div
                      key={`${item.productType}-${item.id}`}
                      className={styles.cartItem}
                    >
                      <div>
                        <span>
                          {item.productType === "test" ? "Test" : "Package"}
                        </span>

                        <h4>
                          {item.productType === "test"
                            ? `Test #${item.id}`
                            : `Package #${item.id}`}
                        </h4>

                        <small>Latest details will be loaded from server</small>
                      </div>

                      <button
                        type="button"
                        className={styles.removeItemBtn}
                        onClick={() => handleRemoveItem(group.patientId, item)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
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

                  <span>{cart.length}</span>
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
                    {cart.reduce(
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
                    ₹{getTotalItems()}
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
                  <h4>Patient #{removePatient.patientId}</h4>

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
    </section>
  );

  
}
