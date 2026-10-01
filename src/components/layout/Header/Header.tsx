"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import { requestOtp, verifyOtp, signUp} from "@/services/auth.service";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  // { code: "bn", label: "Bengali" },
];

export default function Header() {
  const [bannerTouched, setBannerTouched] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [otpRequested, setOtpRequested] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

const [timer, setTimer] = useState(20);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const [signUpFirstName, setSignUpFirstName] =
  useState("");

const [signUpLastName, setSignUpLastName] =
  useState("");

const [signUpMobile, setSignUpMobile] =
  useState("");

const [signUpEmail, setSignUpEmail] =
  useState("");

const [signUpTerms, setSignUpTerms] =
  useState(false);

const [
  signUpOtpRequested,
  setSignUpOtpRequested,
] = useState(false);

const [signUpLoading, setSignUpLoading] =
  useState(false);

const [
  signUpError,
  setSignUpError,
] = useState("");

const [
  signUpSuccess,
  setSignUpSuccess,
] = useState("");
  
  
const [signUpOtp, setSignUpOtp] = useState([
  "",
  "",
  "",
  "",
  "",
  "",
]);

const [signUpTimer, setSignUpTimer] =
  useState(20);


  

  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      const banner = document.querySelector(".banner_wrap");
      if (!header || !banner) return;
      setBannerTouched(
        banner.getBoundingClientRect().bottom <=
        header.getBoundingClientRect().bottom
      );
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  if (
    !signUpOtpRequested ||
    signUpTimer <= 0
  ) {
    return;
  }

  const timer = setInterval(() => {
    setSignUpTimer(
      (previous) => previous - 1
    );
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, [
  signUpOtpRequested,
  signUpTimer,
]);


  useEffect(() => {
  if (!otpRequested || timer <= 0) {
    return;
  }

  const interval = setInterval(() => {
    setTimer((previous) => previous - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [otpRequested, timer]);

  // Google Translate 
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, 
      .skiptranslate,
      iframe.goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0px !important;
        position: static !important;
      }
      .goog-te-gadget-icon {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const addGoogleTranslateScript = () => {
      if (document.getElementById("google-translate-script")) return;
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: LANGUAGES.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  const toggleLang = () => {
    setLangOpen((prev) => !prev);
  };


  const handleGetOtp = async () => {
  setError("");
  setSuccessMessage("");

  const mobile = mobileNumber.trim();

  if (!mobile) {
    setError("Please enter your mobile number.");
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    setError(
      "Please enter a valid 10 digit mobile number."
    );
    return;
  }

  try {
    setLoading(true);

    const response = await requestOtp(mobile);

    console.log(
      "Request OTP Response:",
      response
    );

    setOtpRequested(true);
    setTimer(20);

    setSuccessMessage(
      "OTP sent successfully."
    );
  } catch (error: unknown) {
    console.error(
      "Request OTP Error:",
      error
    );

    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError(
        "Unable to send OTP. Please try again."
      );
    }
  } finally {
    setLoading(false);
  }
  };
  
  const handleOtpChange = (
  index: number,
  value: string
) => {
  const digit = value.replace(/\D/g, "").slice(-1);

  const updatedOtp = [...otp];

  updatedOtp[index] = digit;

  setOtp(updatedOtp);

  if (digit && index < 5) {
    const nextInput =
      document.getElementById(
        `digit-${index + 2}`
      );

    nextInput?.focus();
  }
};

  const handleSelect = (langCode: string) => {
    setSelectedLang(langCode);
    setLangOpen(false);
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    const selectElem = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const handleVerifyOtp = async () => {
  setError("");
  setSuccessMessage("");

  const otpValue = otp.join("");

  if (otpValue.length !== 6) {
    setError(
      "Please enter the complete 6 digit OTP."
    );
    return;
  }

  try {
    setLoading(true);

    const response = await verifyOtp(
      mobileNumber.trim(),
      otpValue
    );

    console.log(
      "Verify OTP Response:",
      response
    );

    if (
      typeof response === "object" &&
      response !== null
    ) {
      const result = response as {
        data?: unknown;
        status?: number;
        success?: boolean;
        message?: string;
      };

      /*
       * Backend business failure
       */
      if (
        result.status === 0 ||
        result.success === false
      ) {
        if (
          typeof result.data === "string"
        ) {
          setError(result.data);
        } else if (
          typeof result.message === "string"
        ) {
          setError(result.message);
        } else {
          setError(
            "OTP verification failed."
          );
        }

        return;
      }

      /*
       * Successful verification
       */
      setSuccessMessage(
        "OTP verified successfully."
      );

      console.log(
        "Login successful:",
        result.data
      );

      return;
    }

    setError(
      "Invalid response received from server."
    );
  } catch (error: unknown) {
    console.error(
      "Verify OTP Error:",
      error
    );

    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError(
        "Unable to verify OTP. Please try again."
      );
    }
  } finally {
    setLoading(false);
  }
};
  // Google Translate 

  // Ctrl + K Search Function
  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearch((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  // Ctrl + K Search Function
  

const handleSignUpGetOtp = async () => {
  setSignUpError("");
  setSignUpSuccess("");

  const mobile =
    signUpMobile.trim();

  if (!mobile) {
    setSignUpError(
      "Please enter your mobile number."
    );
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    setSignUpError(
      "Please enter a valid 10 digit mobile number."
    );
    return;
  }

  try {
    setSignUpLoading(true);

    const response =
      await requestOtp(mobile);

    console.log(
      "Signup Request OTP Response:",
      response
    );

    if (
      typeof response === "object" &&
      response !== null
    ) {
      const result = response as {
        status?: number;
        success?: boolean;
        data?: unknown;
        message?: string;
      };

      if (
        result.status === 0 ||
        result.success === false
      ) {
        const message =
          typeof result.data === "string"
            ? result.data
            : typeof result.message === "string"
              ? result.message
              : "Unable to send OTP.";

        setSignUpError(message);

        return;
      }
    }

    setSignUpOtp([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setSignUpOtpRequested(true);

    setSignUpTimer(20);

    setSignUpSuccess(
      "OTP sent successfully."
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      setSignUpError(error.message);
    } else {
      setSignUpError(
        "Unable to send OTP. Please try again."
      );
    }
  } finally {
    setSignUpLoading(false);
  }
};

  const handleSignUpOtpChange = (
  index: number,
  value: string
) => {
  const digit = value
    .replace(/\D/g, "")
    .slice(-1);

  const updatedOtp = [...signUpOtp];

  updatedOtp[index] = digit;

  setSignUpOtp(updatedOtp);

  setSignUpError("");

  if (digit && index < 5) {
    const nextInput =
      document.getElementById(
        `signup-digit-${index + 2}`
      );

    nextInput?.focus();
  }
  };
  const handleRegister = async () => {
  setSignUpError("");
  setSignUpSuccess("");

  const firstName =
    signUpFirstName.trim();

  const lastName =
    signUpLastName.trim();

  const mobile =
    signUpMobile.trim();

  const email =
    signUpEmail.trim().toLowerCase();

  const otp =
    signUpOtp.join("");

  if (!firstName) {
    setSignUpError(
      "Please enter your first name."
    );
    return;
  }

  if (!lastName) {
    setSignUpError(
      "Please enter your last name."
    );
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    setSignUpError(
      "Please enter a valid 10 digit mobile number."
    );
    return;
  }

  if (!signUpOtpRequested) {
    setSignUpError(
      "Please request OTP first."
    );
    return;
  }

  if (otp.length !== 6) {
    setSignUpError(
      "Please enter the complete 6 digit OTP."
    );
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setSignUpError(
      "Please enter a valid email address."
    );
    return;
  }

  if (!signUpTerms) {
    setSignUpError(
      "Please accept the Terms & Conditions."
    );
    return;
  }

  try {
    setSignUpLoading(true);

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      mobileNumber: mobile,
    };

    const response =
      await signUp(payload);

    console.log(
      "Signup Response:",
      response
    );

    if (
      typeof response === "object" &&
      response !== null
    ) {
      const result = response as {
        status?: number;
        success?: boolean;
        data?: unknown;
        message?: string;
      };

      if (
        result.status === 0 ||
        result.success === false
      ) {
        const message =
          typeof result.data === "string"
            ? result.data
            : typeof result.message === "string"
              ? result.message
              : "Registration failed.";

        setSignUpError(message);

        return;
      }

      const message =
        typeof result.message === "string"
          ? result.message
          : typeof result.data === "string"
            ? result.data
            : "Registration successful.";

      setSignUpSuccess(message);

      return;
    }

    setSignUpSuccess(
      "Registration successful."
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      setSignUpError(error.message);
    } else {
      setSignUpError(
        "Unable to register. Please try again."
      );
    }
  } finally {
    setSignUpLoading(false);
  }
};
  
  return (
    <>
      <div ref={headerRef} className={`${styles["main-header"]} ${bannerTouched ? styles["banner-touched"] : ""}`}>
        <div className={styles['top-wrap']}>
          <img src="/assets/images/bell.svg" alt="Notification Bell" />
          <p>
            Easy online booking for lab tests, diagnostics and complete health checkups at home
            <a href="#">
              Book Test <img src="/assets/images/right-arrow.svg" alt="Right Arrow" />
            </a>
          </p>
        </div>
        <div className={styles['btm-wrap']}>
          <div className={styles['lt-side']}>
            {/* Logo Link */}
            <Link href="/" className={styles.logo}>
              <div className={styles.img}>
                <img src="/assets/images/logo.png" alt="Nirnayan Logo" />
              </div>
              <div className={styles.text}>
                <span className={styles.notranslate} translate="no">Nirnayan</span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className={styles['location']} onClick={() => setIsLocation(true)}>
              <i className="fa-solid fa-location-dot location-icon"></i>
              <h4>Kolkata</h4>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Hidden Block */}
            <div className={styles['hidden-block']}>
              <div className={styles['loc-in']} onClick={() => setIsLocation(true)}>
                <i className="fa-solid fa-location-dot location-icon"></i>
                <h4>Kolkata</h4>
                <i className="fa-solid fa-chevron-down"></i>
              </div>

              <div className={styles['test-search']}>
                <div className={styles.divider}></div>
                <div className="d-flex align-items-center flex-grow-1">
                  <span className={styles['search-text']}>
                    Search for
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <img src="/assets/images/rx.svg" alt="Rx Icon" />
                  <div className={styles.divider}></div>
                  <div className={styles.shortcut}>Ctrl+K</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['rt-side']}>
            <div className={styles.navigation}>
              <ul>
                <li>
                  <Link
                    href="#">
                    <img src="/assets/images/blood.svg" alt="Test Icon" /> Test
                  </Link>
                </li>
                <li>
                  <Link
                    href="#">
                    <img src="/assets/images/package.svg" alt="Package Icon" /> Packages
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles['more-btns']}>
              <a href="#">
                More <i className="fa-solid fa-chevron-down"></i>
              </a>
            </div>

            <div className={`${styles.lang_switcher} lang-switcher ${langOpen ? "open" : ""}`}>
              <button type="button" className={styles.lang_trigger} onClick={toggleLang}>
                <img src="/assets/images/lang-switch.svg" alt="Language Switcher" />
                <i className="fa-solid fa-chevron-down"></i>
              </button>

              {langOpen && (
                <div className={styles.lang_dropdown}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`${styles['lang-item']} ${selectedLang === lang.code ? styles.active : ""}`}
                      onClick={() => handleSelect(lang.code)}
                    >
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles['cart-wrap']}>
              <Link href='#'>
                <i className="fa-solid fa-cart-shopping"></i>
                <span className={styles['number']}>0</span>
              </Link>
            </div>

            <div className={`user ${styles.user}`}>
              <div className={`dropdown ${styles.dropdown}`}>
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className={styles.img}>
                    <img src="/assets/images/user.png" alt="User" />
                  </span>
                </button>
                <ul className={`dropdown-menu ${styles.dropdown_menu}`}>
                  <li>
                    <a className={`dropdown-item ${styles.dropdown_item}`} href="#" onClick={() => setIsOpen(true)}>
                      <img src="/assets/images/sign-in.svg" alt="" />
                      Sign in
                    </a>
                  </li>
                  <li>
                    <a className={`dropdown-item ${styles.dropdown_item}`} href="#" onClick={() => setIsSignIn(true)}>
                      <img src="/assets/images/log-in.svg" alt="" />
                      Sign Up
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sign Up Modal Start */}
      {isSignIn && (
  <div
    className={`is-logged ${
      isSignIn ? "active" : ""
    }`}
    onClick={() =>
      setIsSignIn(false)
    }
  >
    <div
      className="inn"
      onClick={(e) =>
        e.stopPropagation()
      }
    >
      <div className="row align-items-center">

        {/* LEFT IMAGE */}

        <div className="col-lg-6 col-sm-12">

          <div className="img">

            <img
              src="/assets/images/log-img.png"
              alt="Sign Up"
            />

          </div>

        </div>

        {/* SIGNUP FORM */}

        <div className="col-lg-6 col-sm-12">

          <div className="text">

            <h3>Sign Up</h3>

            <div className="row">

              {/* FIRST NAME */}

              <div className="col-lg-6 col-md-12 col-sm-12">

                <div className="block">

                  <label className="lbl">
                    First Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      signUpFirstName
                    }
                    onChange={(e) => {
                      setSignUpFirstName(
                        e.target.value
                      );

                      setSignUpError("");
                    }}
                  />

                </div>

              </div>

              {/* LAST NAME */}

              <div className="col-lg-6 col-md-12 col-sm-12">

                <div className="block">

                  <label className="lbl">
                    Last Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      signUpLastName
                    }
                    onChange={(e) => {
                      setSignUpLastName(
                        e.target.value
                      );

                      setSignUpError("");
                    }}
                  />

                </div>

              </div>

              {/* MOBILE */}

              <div className="col-lg-12 col-md-12 col-sm-12">

                <div className="block">

                  <label className="lbl">
                    Mobile Number
                    <span>*</span>
                  </label>

                  <div className="position-relative">

                    <input
                      type="tel"
                      placeholder="Enter your 10 digit mobile number"
                      className="form-control"
                      maxLength={10}
                      value={signUpMobile}
                      disabled={
                        signUpOtpRequested
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setSignUpMobile(
                          value
                        );

                        setSignUpError("");
                      }}
                    />

                    <button
                      type="button"
                      id="otpButton"
                      onClick={
                        handleSignUpGetOtp
                      }
                      disabled={
                        signUpLoading ||
                        signUpOtpRequested ||
                        signUpMobile.length !==
                          10
                      }
                    >
                      {signUpLoading
                        ? "Sending..."
                        : signUpOtpRequested
                          ? "OTP Sent"
                          : "Get OTP"}
                    </button>

                  </div>

                </div>

              </div>

              {/* OTP SECTION */}

              {signUpOtpRequested && (
                <div className="col-lg-12 col-md-12 col-sm-12">

                  <h5>
                    Enter Your OTP
                  </h5>

                  <div className="digit-group">

                    {signUpOtp.map(
                      (digit, index) => (
                        <input
                          key={index}
                          type="tel"
                          id={`signup-digit-${index + 1}`}
                          name={`signup-digit-${index + 1}`}
                          value={digit}
                          maxLength={1}
                          required
                          onChange={(e) =>
                            handleSignUpOtpChange(
                              index,
                              e.target.value
                            )
                          }
                        />
                      )
                    )}

                  </div>

                  <div className="otpRequested">

                    {signUpTimer > 0 ? (
                      <p>
                        Time Remaining:{" "}
                        <span>
                          {signUpTimer} sec
                        </span>
                      </p>
                    ) : (
                      <p>
                        OTP expired.
                      </p>
                    )}

                  </div>

                </div>
              )}

              {/* EMAIL */}

              <div className="col-lg-12 col-md-12 col-sm-12">

                <div className="block">

                  <label className="lbl">
                    Email Address
                    <span>*</span>
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="form-control"
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(
                        e.target.value
                      );

                      setSignUpError("");
                    }}
                  />

                </div>

              </div>

              {/* TERMS */}

              <div className="col-lg-12 col-md-12 col-sm-12">

                <label className="check-custom">

                  <input
                    type="checkbox"
                    checked={
                      signUpTerms
                    }
                    onChange={(e) =>
                      setSignUpTerms(
                        e.target.checked
                      )
                    }
                  />

                  <span className="checkmark" />

                  <span className="sp-lbl">
                    I agree to the{" "}

                    <a
                      href="#"
                      onClick={(e) =>
                        e.preventDefault()
                      }
                    >
                      Terms & Conditions
                    </a>

                  </span>

                </label>

              </div>

              {/* ERROR */}

              {signUpError && (
                <div className="col-12">

                  <p
                    style={{
                      color: "#d92d20",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {signUpError}
                  </p>

                </div>
              )}

              {/* SUCCESS */}

              {signUpSuccess && (
                <div className="col-12">

                  <p
                    style={{
                      color: "#16803c",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {signUpSuccess}
                  </p>

                </div>
              )}

            </div>

            {/* REGISTER */}

            <button
              type="button"
              className="cmn_btn w-100"
              onClick={
                handleRegister
              }
              disabled={
                signUpLoading
              }
            >
              {signUpLoading
                ? "Registering..."
                : "Register"}
            </button>

            {/* SIGN IN */}

            <p className="text-center mt-3">

              I already have an account
              {" | "}

              <a
                href="#"
                className="sign-text"
                onClick={(e) => {
                  e.preventDefault();

                  setIsSignIn(false);

                  setIsOpen(true);
                }}
              >
                Sign In
              </a>

            </p>

          </div>

        </div>

      </div>
    </div>
  </div>
)}
      {/* Sign Up Modal End */}

      {/* Sign In Modal Start */}
      {isOpen && (
  <div
    className={`is-logged ${isOpen ? "active" : ""}`}
    onClick={() => setIsOpen(false)}
    >
    <div
      className="inn"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="row align-items-center">

        {/* LEFT IMAGE */}

        <div className="col-lg-6 col-sm-12">
          <div className="img">
            <img
              src="/assets/images/log-img.png"
              alt="Login"
            />
          </div>
        </div>

        {/* RIGHT LOGIN */}

        <div className="col-lg-6 col-sm-12">
          <div className="text">

            <h3>
              Sign in to your account
            </h3>

            <p>
              View your reports and upcoming
              health checkups at one place.
            </p>

            <div className="row">

              {/* MOBILE NUMBER */}

              <div className="col-lg-12 col-md-12 col-sm-12">

                <div className="block">

                  <label className="lbl">
                    Mobile Number
                    <span>*</span>
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter your 10 digit mobile number"
                    className="form-control"
                    value={mobileNumber}
                    maxLength={10}
                    disabled={
                      loading ||
                      otpRequested
                    }
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setMobileNumber(value);

                      setError("");
                      setSuccessMessage("");
                    }}
                  />

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="col-12">
                  <p
                    style={{
                      color: "#d92d20",
                      marginTop: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* SUCCESS */}

              {successMessage && (
                <div className="col-12">
                  <p
                    style={{
                      color: "#16803c",
                      marginTop: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {successMessage}
                  </p>
                </div>
              )}

              {/* OTP SECTION */}

              {otpRequested && (
                <div className="col-lg-12 col-md-12 col-sm-12">

                  <h5>
                    Enter Your OTP
                  </h5>

                  <div className="digit-group">

                    {otp.map(
                      (digit, index) => (
                        <input
                          key={index}
                          type="tel"
                          id={`digit-${index + 1}`}
                          name={`digit-${index + 1}`}
                          value={digit}
                          maxLength={1}
                          required
                          onChange={(event) =>
                            handleOtpChange(
                              index,
                              event.target.value
                            )
                          }
                        />
                      )
                    )}

                  </div>

                  <div className="otpRequested">

                    {timer > 0 ? (
                      <p>
                        Time Remaining:{" "}
                        <span>
                          {timer} sec
                        </span>
                      </p>
                    ) : (
                      <p>
                        OTP expired. You can
                        request another OTP.
                      </p>
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* GET OTP */}

            {!otpRequested && (
              <button
                type="button"
                className="cmn_btn w-100"
                onClick={handleGetOtp}
                disabled={
                  loading ||
                  mobileNumber.length !== 10
                }
              >
                {loading
                  ? "Sending OTP..."
                  : "Get OTP"}
              </button>
            )}

            {/* OTP RECEIVED */}

            {otpRequested && (
            <button
              type="button"
              className="cmn_btn w-100"
              onClick={handleVerifyOtp}
              disabled={
                loading ||
                otp.some((digit) => digit === "")
              }
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>
          )}

          </div>
        </div>

      </div>
    </div>
  </div>
        )}
      {/* Sign In Modal End */}

      {/* Location Modal Start */}
      {isLocation && (
        <div className={`location-modal-backdrop ${isLocation ? 'active' : ''}`} onClick={() => setIsLocation(false)}>
          <div className="inn" onClick={(e) => e.stopPropagation()}>
            <div className="search-wrap position-relative">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Search Your City" className="form-control" />
            </div>
            <h6>Select Location</h6>
            <ul>
              <li className="select-city">
                <div className="img">
                  <img src="/assets/images/kolkata.png" alt="" />
                </div>
                <h6>Kolkata</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/siliguri.png" alt="" />
                </div>
                <h6>Siliguri</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/patna.png" alt="" />
                </div>
                <h6>Patna</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/asansol.png" alt="" />
                </div>
                <h6>Asansol</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/assam.png" alt="" />
                </div>
                <h6>Assam</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/baharampur.png" alt="" />
                </div>
                <h6>Baharampur</h6>
              </li>
            </ul>
          </div>
        </div>
      )}
      {/* Location Modal End */}

      {/* Search Modal Start */}
      {isSearch && (
        <div className={`modal_backdrop ${isSearch ? 'active' : ''}`} onClick={() => setIsSearch(false)}>
          <div className="lab-search-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lab-search-field">
              <i className="fa-solid fa-magnifying-glass lab-search-symbol"></i>
              <input type="text" placeholder="Search for Tests, Health Check-ups"
                name="labSearch" className="form-control" />
              <div className="flex-dv d-flex align-items-center gap-2">
                <button type="button" className="lab-search-rx">
                  <img src="/assets/images/rx.svg" alt="" />
                </button>
                <span className="lab-search-line"></span>
                <button type="button" className="lab-search-mike">
                  <i className="fa-solid fa-microphone lab-mic-symbol"></i>
                </button>
              </div>
            </div>
            <div className="lab-search-content">
              {/* POPULAR TESTS */}
              <section className="lab-result-group">
                <h6>Popular Tests</h6>
                <div className="scroll-pnl">
                  <div className="lab-result-row">
                    <div className="lab-result-picture lab-test-picture">
                      <i className="fa-solid fa-vial"></i>
                    </div>

                    <div className="lab-result-details">
                      <div className="lab-result-name">
                        CBC
                      </div>
                      <div className="lab-result-category">
                        Tests
                      </div>
                    </div>

                    <div className="lab-result-action">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </section>

              {/* POPULAR PACKAGE */}
              <section className="lab-result-group">
                <h6>Popular Package</h6>
                <div className="scroll-pnl">
                  <div className="lab-result-row">
                    <div className="lab-result-picture lab-package-picture">
                      <i className="fa-solid fa-file-medical"></i>
                    </div>
                    <div className="lab-result-details">
                      <div className="lab-result-name">
                        Suswastham 4.2 - Diabetes Check Up Package - Prime
                      </div>
                      <div className="lab-result-category">
                        Package
                      </div>
                    </div>

                    <div className="lab-result-action">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </section>

              {/* TRENDING SEARCHES */}
              <section className="lab-result-group lab-trending-group">
                <h6>Trending Searches</h6>
                <div className="lab-result-row">
                  <div className="lab-result-picture lab-trending-picture">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div className="lab-result-details">
                    <div className="lab-result-name">
                      Glucose-Fasting-Plasma
                    </div>
                    <div className="lab-result-category">
                      Tests
                    </div>
                  </div>
                  <div className="lab-result-action">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>

                <div className="lab-result-row">
                  <div className="lab-result-picture lab-trending-picture">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div className="lab-result-details">
                    <div className="lab-result-name">
                      Glucose-Fasting-Plasma
                    </div>
                    <div className="lab-result-category">
                      Tests
                    </div>
                  </div>
                  <div className="lab-result-action">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>

                <div className="lab-result-row">
                  <div className="lab-result-picture lab-trending-picture">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div className="lab-result-details">
                    <div className="lab-result-name">
                      Suswastham-125-Infertility-Package-Male-Prime
                    </div>
                    <div className="lab-result-category">
                      Package
                    </div>
                  </div>
                  <div className="lab-result-action">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>
              </section>

              <div className="lab-search-assistance">
                <div className="inn">
                  <span className="lab-assistance-icon">
                    <img src="/assets/images/bot.svg" alt="" />
                  </span>
                  <span className="lab-assistance-text">
                    Not Sure which tests right?
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Search Modal End */}

    </>
  );
}