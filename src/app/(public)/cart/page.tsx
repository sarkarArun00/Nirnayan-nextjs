"use client";

import { useEffect, useState } from "react";

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

type CartGroup = {
  patient: CartPatient;
  items: CartProduct[];
};

const CART_KEY = "nirnayan_temp_cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartGroup[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getTotal = () => {
    return cart.reduce((total, group) => {
      const patientTotal = group.items.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0,
      );

      return total + patientTotal;
    }, 0);
  };

  if (loading) {
    return <div className="container py-5">Loading cart...</div>;
  }

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
                <div
                  key={group.patient.id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "20px",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  {/* Patient */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: "15px",
                      marginBottom: "15px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "18px",
                          marginBottom: "4px",
                        }}
                      >
                        {group.patient.name}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#777",
                        }}
                      >
                        {group.patient.gender}

                        {group.patient.age
                          ? ` · ${group.patient.age} Years`
                          : ""}

                        {group.patient.bloodGroup
                          ? ` · ${group.patient.bloodGroup}`
                          : ""}
                      </p>
                    </div>

                    <span
                      style={{
                        background: "#ecfff5",
                        color: "#079653",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      Patient
                    </span>
                  </div>

                  {/* Products */}
                  {group.items.map((item) => (
                    <div
                      key={`${item.productType}-${item.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "15px",
                        padding: "15px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "inline-block",
                            marginBottom: "5px",
                            color: "#08a95e",
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {item.productType}
                        </span>

                        <h4
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: 600,
                          }}
                        >
                          {item.name}
                        </h4>
                      </div>

                      <strong
                        style={{
                          fontSize: "17px",
                        }}
                      >
                        ₹{Number(item.price || 0).toFixed(2)}
                      </strong>
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
    </section>
  );
}
