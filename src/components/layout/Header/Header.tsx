"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import {
  requestOtp,
  verifyOtp,
  signUp,
  requestLoginOtp,
} from "@/services/auth.service";
import {
  loginWithOtp,
  getLoggedInUser,
  logoutSession,
} from "@/actions/session.actions";
import { useAlert } from "@/components/common/Alert/AlertProvider";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
];

type LoginUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
};

type LoginResponse = {
  status?: number;
  success?: boolean;
  accessToken?: string;
  massage?: string;
  message?: string;
  data?: LoginUser | string;
};

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

  const [signUpFirstName, setSignUpFirstName] = useState("");

  const [signUpLastName, setSignUpLastName] = useState("");

  const [signUpMobile, setSignUpMobile] = useState("");

  const [signUpEmail, setSignUpEmail] = useState("");

  const [signUpTerms, setSignUpTerms] = useState(false);

  const [signUpOtpRequested, setSignUpOtpRequested] = useState(false);

  const [signUpLoading, setSignUpLoading] = useState(false);

  const [signUpError, setSignUpError] = useState("");

  const [signUpSuccess, setSignUpSuccess] = useState("");

  const [signUpOtp, setSignUpOtp] = useState(["", "", "", "", "", ""]);

  const [signUpTimer, setSignUpTimer] = useState(20);

  const [loginSession, setLoginSession] = useState<{
    user: LoginUser;
  } | null>(null);

  const { confirm } = useAlert();

  const [sessionLoading, setSessionLoading] = useState(true);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);

  const { showAlert } = useAlert();

  const handleChangeSignUpMobile = () => {
    // Allow user to edit the mobile number again
    setSignUpOtpRequested(false);

    // Clear previously entered OTP
    setSignUpOtp(["", "", "", "", "", ""]);

    // Reset OTP countdown
    setSignUpTimer(20);

    // Clear messages
    setSignUpError("");
    setSignUpSuccess("");
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      const banner = document.querySelector(".banner_wrap");
      if (!header || !banner) return;
      setBannerTouched(
        banner.getBoundingClientRect().bottom <=
        header.getBoundingClientRect().bottom,
      );
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!signUpOtpRequested || signUpTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSignUpTimer((previous) => previous - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [signUpOtpRequested, signUpTimer]);

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
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: LANGUAGES.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element",
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  const toggleLang = () => {
    setLangOpen((prev) => !prev);
  };


  const pathname = usePathname();

  useEffect(() => {
    const logUser = () => {
      if (loginSession?.user) {
        console.log("Logged-in User:", loginSession.user);
      } else {
        console.log("No user logged in");
      }
    };

    // When the page opens, route changes, or session changes
    logUser();

    // When the browser window receives focus
    window.addEventListener("focus", logUser);

    return () => {
      window.removeEventListener("focus", logUser);
    };
  }, [pathname, loginSession?.user]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);


  useEffect(() => {
    let active = true;

    const restoreLoginSession = async () => {
      try {
        const user = await getLoggedInUser();

        if (!active) return;

        if (user) {
          setLoginSession({ user });
        } else {
          setLoginSession(null);
        }
      } catch (error) {
        if (active) {
          setLoginSession(null);
        }

        console.error("Unable to restore login session");
      } finally {
        if (active) {
          setSessionLoading(false);
        }
      }
    };

    void restoreLoginSession();

    return () => {
      active = false;
    };
  }, []);


  const handleLogout = async () => {
    try {
      const accepted = await confirm({
        title: "Logout Confirmation",
        message: "Are you sure you want to log out?",
        confirmText: "Yes, Logout",
        cancelText: "Cancel",
      });

      if (!accepted) return;
      // Clear the secure session cookie
      await logoutSession();

      // Clear local UI state
      setLoginSession(null);
      setMobileNumber("");
      setOtp(["", "", "", "", "", ""]);
      setOtpRequested(false);
      setTimer(20);

      setError("");
      setSuccessMessage("");

      setIsAccountMenuOpen(false);
      setIsOpen(false);
      setIsSignIn(false);

      // showAlert({
      //   type: "success",
      //   title: "Logged Out",
      //   message: "You have successfully logged out.",
      //   autoClose: 1500,
      // });
    } catch {
      showAlert({
        type: "error",
        title: "Logout Failed",
        message: "Unable to log out. Please try again.",
        autoClose: 3000,
      });
    }
  };

  // Google Translate

  // Ctrl + K Search Function
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearch((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearch(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  // Ctrl + K Search Function

  // const handleGetOtp = async () => {
  //   setError("");
  //   setSuccessMessage("");

  //   const mobile = mobileNumber.trim();

  //   if (!mobile) {
  //     setError("Please enter your mobile number.");
  //     return;
  //   }

  //   if (!/^\d{10}$/.test(mobile)) {
  //     setError("Please enter a valid 10 digit mobile number.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await requestOtp(mobile);

  //     console.log("Request OTP Response:", response);

  //     setOtpRequested(true);
  //     setTimer(20);

  //     setSuccessMessage("OTP sent successfully.");
  //   } catch (error: unknown) {
  //     console.error("Request OTP Error:", error);

  //     if (error instanceof Error) {
  //       setError(error.message);
  //     } else {
  //       setError("Unable to send OTP. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGetLoginOtp = async () => {
    setError("");
    setSuccessMessage("");

    const mobile = mobileNumber.trim();

    if (!mobile) {
      setError("Please enter your mobile number.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      showAlert({
        type: "warning",
        title: "Invalid Mobile Number",
        message: "Please enter a valid 10-digit mobile number.",
        buttonText: "OK",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await requestLoginOtp(mobile);

      console.log("Request OTP Response:", response);
      const result = response as LoginResponse | null;
      if (result?.status == 1) {
        setOtpRequested(true);
        setTimer(20);

        showAlert({
          type: "success", // "warning" or "error"
          title: "Sent",
          message: "OTP sent successfully.",
          autoClose: 1000,
        });
      }
      else if (result?.status == 0) {
        const errorMessage =
          typeof result?.data === "string"
            ? result.data
            : "OTP verification failed. Please try again.";

        showAlert({
          type: "warning",
          title: "Login Failed",
          message: errorMessage,
          buttonText: "OK",
          autoClose: 3000,
        });
      }
    } catch (error: unknown) {
      console.error("Request OTP Error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        showAlert({
          type: "error",
          title: "Unable to send OTP",
          message:
            error instanceof Error
              ? error.message
              : "Unable to send OTP. Please try again.",
          buttonText: "Try Again",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];

    updatedOtp[index] = digit;

    setOtp(updatedOtp);

    if (digit && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 2}`);

      nextInput?.focus();
    }
  };

  const handleSelect = (langCode: string) => {
    setSelectedLang(langCode);
    setLangOpen(false);
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    const selectElem = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  // Signup OTP start
  const handleSignUpGetOtp = async () => {
    setSignUpError("");
    setSignUpSuccess("");

    const mobile = signUpMobile.trim();

    if (!mobile) {
      showAlert({
        type: "warning",
        title: "Mobile No. Required",
        message: "Please enter your mobile number.",
        autoClose: 1000,
      });
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      showAlert({
        type: "warning",
        title: "Invalid Mobile Number",
        message: "Please enter a valid 10-digit mobile number.",
        buttonText: "OK",
      });

      return;
    }

    try {
      setSignUpLoading(true);
      const response = await requestOtp(mobile);

      if (typeof response === "object" && response !== null) {
        const result = response as {
          status?: number;
          success?: boolean;
          data?: unknown;
          message?: string;
        };

        if (result.status === 0 || result.success === false) {
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

      setSignUpOtp(["", "", "", "", "", ""]);

      setSignUpOtpRequested(true);

      setSignUpTimer(20);

      // setSignUpSuccess("OTP sent successfully.");
      showAlert({
        type: "success",
        title: "OTP Sent",
        message: "OTP sent successfully.",
        autoClose: 1000,
      });
    } catch (error: unknown) {
      showAlert({
        type: "error",
        title: "Request Failed",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        buttonText: "Try Again",
      });
    } finally {
      setSignUpLoading(false);
    }
  };
  // Signup OTP end

  const handleSignUpOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...signUpOtp];

    updatedOtp[index] = digit;

    setSignUpOtp(updatedOtp);

    setSignUpError("");

    if (digit && index < 5) {
      const nextInput = document.getElementById(`signup-digit-${index + 2}`);

      nextInput?.focus();
    }
  };

  // Signup Start
  const handleRegister = async () => {
    setSignUpError("");
    setSignUpSuccess("");

    const firstName = signUpFirstName.trim();

    const lastName = signUpLastName.trim();

    const mobile = signUpMobile.trim();

    const email = signUpEmail.trim().toLowerCase();

    const otp = signUpOtp.join("");

    if (!firstName) {
      setSignUpError("Please enter your first name.");
      return;
    }

    if (!lastName) {
      setSignUpError("Please enter your last name.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setSignUpError("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (!signUpOtpRequested) {
      setSignUpError("Please request OTP first.");
      return;
    }

    if (otp.length !== 6) {
      setSignUpError("Please enter the complete 6 digit OTP.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setSignUpError("Please enter a valid email address.");
      return;
    }

    if (!signUpTerms) {
      setSignUpError("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setSignUpLoading(true);

      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        mobileNumber: mobile,
        otp: otp,
      };

      const response = await signUp(payload);

      const result =
        typeof response === "object" && response !== null
          ? (response as {
            data?: unknown;
            status?: number;
            success?: boolean;
            message?: string;
          })
          : null;

      // SIGNUP SUCCESS
      if (result?.status === 1 && result.success === true) {
        // Prefill mobile number in Login popup
        setMobileNumber(mobile);
        showAlert({
          type: "success",
          title: "Registration Successful!",
          message:
            "Your account has been created successfully. Please sign in to continue.",
          buttonText: "Continue",
          autoClose: 2000,
        });
        // Reset Login OTP state
        setOtpRequested(false);
        setOtp(["", "", "", "", "", ""]);
        setTimer(20);
        setError("");
        setSuccessMessage("");

        // Clear Signup form
        setSignUpFirstName("");
        setSignUpLastName("");
        setSignUpMobile("");
        setSignUpEmail("");
        setSignUpTerms(false);
        setSignUpOtp(["", "", "", "", "", ""]);
        setSignUpOtpRequested(false);
        setSignUpTimer(20);
        setSignUpError("");
        setSignUpSuccess("");

        // Close Signup popup
        setIsSignIn(false);

        // Open Login popup
        setIsOpen(true);

        return;
      } else {
        showAlert({
          type: "error",
          title: "Registration Failed!",
          message: "Unable to register. Please try again.",
          buttonText: "Ok",
          autoClose: 2000,
        });
      }

      // SIGNUP FAILURE
      const message =
        typeof result?.data === "string"
          ? result.data
          : typeof result?.message === "string"
            ? result.message
            : "Registration failed. Please try again.";

      setSignUpError(message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSignUpError(error.message);
      } else {
        setSignUpError("Unable to register. Please try again.");
      }
    } finally {
      setSignUpLoading(false);
    }
  };
  // Signup End

  // Login Start
  const handleVerifyOtp = async () => {
    setError("");
    setSuccessMessage("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      showAlert({
        type: "warning",
        title: "Incomplete OTP",
        message: "Please enter the complete 6 digit OTP.",
        autoClose: 2000,
      });

      return;
    }

    try {
      setLoading(true);

      // Verify OTP and save secure session
      const result = await loginWithOtp(mobileNumber.trim(), otpValue);

      if (!result.success) {
        showAlert({
          type: "warning",
          title: "Login Failed",
          message: result.message,
          buttonText: "OK",
          autoClose: 3000,
        });

        return;
      }

      // Keep only user information in React state
      setLoginSession({
        user: result.user,
      });

      // Reset login form
      setOtpRequested(false);
      setOtp(["", "", "", "", "", ""]);
      setTimer(20);

      setError("");
      setSuccessMessage("");

      // Close login modal
      setIsOpen(false);
      setIsAccountMenuOpen(false);

      // Success alert
      showAlert({
        type: "success",
        title: "Login Successful!",
        message: `Welcome back, ${result.user.first_name}!`,
        buttonText: "Continue",
        autoClose: 2000,
      });
    } catch (error: unknown) {
      showAlert({
        type: "error",
        title: "Login Error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Login End
  // For More Menu Start
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);
  const [isOpens, setIsOpens] = useState(false);

  const menuData = [
    {
      id: 'company',
      label: 'Company',
      content: [
        { label: 'About Us', link: '/about' },
        { label: 'Our Team', link: '/team' },
        { label: 'Journey', link: '/journey' },
        { label: 'Careers With Us', link: '/careers', badge: 'Hiring' },
        { label: 'Contact Us', link: '/contact' },
      ],
    },
    {
      id: 'laboratory',
      label: 'Laboratory',
      content: [
        { label: 'Lab Tests', link: '/tests' },
        { label: 'Diagnostic Tools', link: '/diagnostics' },
        { label: 'Quality Standards', link: '/quality' },
      ],
    },
    {
      id: 'quick-link',
      label: 'Quick Link',
      content: [
        { label: 'Book Appointment', link: '/book' },
        { label: 'Download Reports', link: '/reports' },
        { label: 'FAQs', link: '/faqs' },
      ],
    },
    {
      id: 'patients',
      label: 'Patients',
      content: [
        { label: 'Patient Portal', link: '/portal' },
        { label: 'Insurance Info', link: '/insurance' },
        { label: 'Preparation Guide', link: '/prep' },
      ],
    },
  ];

  const toggleAccordion = (index: number) => {
    setMobileOpenIndex((previous) =>
      previous === index ? null : index
    );
  };
  // For More Menu End

  return (
    <>
      <div
        ref={headerRef}
        className={`${styles["main-header"]} ${bannerTouched ? styles["banner-touched"] : ""}`}
      >
        <div className={styles["top-wrap"]}>
          <img src="/assets/images/bell.svg" alt="Notification Bell" />
          <p>
            Easy online booking for lab tests, diagnostics and complete health
            checkups at home
            <a href="#">
              Book Test{" "}
              <img src="/assets/images/right-arrow.svg" alt="Right Arrow" />
            </a>
          </p>
        </div>
        <div className={styles["btm-wrap"]}>
          <div className={styles["lt-side"]}>
            {/* Logo Link */}
            <Link href="/" className={styles.logo}>
              <div className={styles.img}>
                <img src="/assets/images/logo.png" alt="Nirnayan Logo" />
              </div>
              <div className={styles.text}>
                <span className={styles.notranslate} translate="no">
                  Nirnayan
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <div
              className={styles["location"]}
              onClick={() => setIsLocation(true)}
            >
              <i className="fa-solid fa-location-dot location-icon"></i>
              <h4>Kolkata</h4>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Hidden Block */}
            <div className={styles["hidden-block"]}>
              <div
                className={styles["loc-in"]}
                onClick={() => setIsLocation(true)}
              >
                <i className="fa-solid fa-location-dot location-icon"></i>
                <h4>Kolkata</h4>
                <i className="fa-solid fa-chevron-down"></i>
              </div>

              <div className={styles["test-search"]}>
                <div className={styles.divider}></div>
                <div className="d-flex align-items-center flex-grow-1">
                  <span className={styles["search-text"]}>Search for</span>
                </div>
                <div className="d-flex align-items-center">
                  <img src="/assets/images/rx.svg" alt="Rx Icon" />
                  <div className={styles.divider}></div>
                  <div className={styles.shortcut}>Ctrl+K</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["rt-side"]}>
            <div className={styles.navigation}>
              <ul>
                <li>
                  <Link href="#">
                    <img src="/assets/images/blood.svg" alt="Test Icon" /> Test
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <img src="/assets/images/package.svg" alt="Package Icon" />{" "}
                    Packages
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles["more-btns"]} onClick={() => setIsOpens((prev) => !prev)}>
              <a href="#">
                More <i className="fa-solid fa-chevron-down"></i>
              </a>
            </div>

            <div
              className={`${styles.lang_switcher} lang-switcher ${langOpen ? "open" : ""}`}
            >
              <button
                type="button"
                className={styles.lang_trigger}
                onClick={toggleLang}
              >
                <img
                  src="/assets/images/lang-switch.svg"
                  alt="Language Switcher"
                />
                <i className="fa-solid fa-chevron-down"></i>
              </button>

              {langOpen && (
                <div className={styles.lang_dropdown}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`${styles["lang-item"]} ${selectedLang === lang.code ? styles.active : ""}`}
                      onClick={() => handleSelect(lang.code)}
                    >
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!sessionLoading && loginSession && (
              <div className={styles["cart-wrap"]}>
                <Link href="#">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span className={styles["number"]}>0</span>
                </Link>
              </div>
            )}

            {/* USER ACCOUNT DROPDOWN */}

            <div className={`user ${styles.user}`} ref={accountMenuRef}>
              <div className={styles.accountDropdown}>
                {/* ACCOUNT TRIGGER */}

                <button
                  type="button"
                  className={styles.accountTrigger}
                  onClick={() => setIsAccountMenuOpen((previous) => !previous)}
                  aria-expanded={isAccountMenuOpen}
                  disabled={sessionLoading}
                  aria-controls="header-account-menu"
                  aria-label={
                    loginSession ? "Open profile menu" : "Open account menu"
                  }
                >
                  {loginSession ? (
                    <span className={styles.accountAvatar}>
                      {loginSession.user.first_name
                        ?.trim()
                        .charAt(0)
                        .toUpperCase() || "U"}
                    </span>
                  ) : (
                    // <span className={styles.guestAvatar}>
                    <img src="/assets/images/user.png" alt="" />
                    // </span>
                  )}

                  {/* <i className="fa-solid fa-chevron-down" /> */}
                </button>

                {/* DROPDOWN CONTENT */}

                {!sessionLoading && isAccountMenuOpen && (
                  <div id="header-account-menu" className={styles.dropdown_menu}>
                    {loginSession ? (
                      <>
                        <button>
                          <img src="/assets/images/profile.svg" alt="" /> My Profile
                        </button>
                        <button>
                          <img src="/assets/images/orders.svg" alt="" /> My Order
                        </button>
                        <button>
                          <img src="/assets/images/rx.svg" alt="" /> Prescriptions
                        </button>
                        <button><img src="/assets/images/logout.svg" alt="" /> Logout</button>
                      </>
                    ) : (
                      <>
                        {/* GUEST: SIGN IN */}

                        <button
                          type="button"
                          className={styles.accountMenuButton}
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            setIsSignIn(false);
                            setIsOpen(true);
                          }}
                        >
                          <img src="/assets/images/sign-in.svg" alt="" />
                          <span>Sign In</span>
                        </button>

                        {/* GUEST: SIGN UP */}

                        <button
                          type="button"
                          className={styles.accountMenuButton}
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            setIsOpen(false);
                            setIsSignIn(true);
                          }}
                        >
                          <img src="/assets/images/log-in.svg" alt="" />
                          <span>Sign Up</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpens((prev) => !prev)} className={`d-block d-xl-none ${styles.mob_menu}`}>
            <img src="/assets/images/menu-icon.svg" alt="" />
          </button>
        </div>

        <div className={`${styles.sub_menu} ${isOpens ? styles.show : ""}`}>
          <button className={styles.close_btn} onClick={() => setIsOpens(false)}><i className="fa-solid fa-x"></i></button>
          <div className="container">
            <div className={`row ${styles.row}`}>
              <div className={`col-xl-4 col-lg-12 col-md-12 col-sm-12 ${styles.menu_column}`}>
                <h2>Explore More</h2>
                <h4>Everything you need, all in one place.</h4>
                <p>Explore our wide range of healthcare services, diagnostic solutions, health packages, and helpful resources, all in one place. Find everything you need to make your healthcare journey simple, convenient, and hassle-free.</p>
              </div>
              <div className={`col-xl-4 col-lg-6 col-md-6 col-sm-12 ${styles.menu_column}`}>
                <div className={styles.flex_wrap}>
                  <ul className={styles.sidebar}>
                    {menuData.map((item, index) => {
                      const isActive = activeIndex === index;
                      return (
                        <li
                          key={item.id}
                          className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                          onMouseEnter={() => setActiveIndex(index)}
                        >
                          <span>{item.label}</span>
                          <span className={styles.arrow}>
                            {isActive ? (
                              // <i className="fa-solid fa-arrow-right"></i>
                              <i className="fa-solid fa-chevron-right"></i>
                            ) : (
                              <i className="fa-solid fa-chevron-right"></i>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <ul className={styles.linkList}>
                    {menuData[activeIndex]?.content.map((linkItem, i) => (
                      <li key={i} className={styles.linkRow}>
                        <a href={linkItem.link} className={styles.navLink}>
                          {linkItem.label}
                        </a>
                        {linkItem.badge && (
                          <span className={styles.badge}>{linkItem.badge}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.accordionContainer}>
                  {menuData.map((item, index) => {
                    const isOpen = mobileOpenIndex === index;

                    return (
                      <div
                        key={item.id}
                        className={styles.accordionItem}
                      >
                        <button
                          type="button"
                          className={`${styles.accordionHeader} ${isOpen ? styles.activeHeader : ""
                            }`}
                          onClick={() => toggleAccordion(index)}
                          aria-expanded={isOpen}
                        >
                          <span>{item.label}</span>

                          <span className={styles.accordionIcon}>
                            <i
                              className={`fa-solid ${isOpen
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                                }`}
                            />
                          </span>
                        </button>

                        {isOpen && (
                          <ul className={styles.mobileLinkList}>
                            {item.content.map((linkItem, i) => (
                              <li
                                key={i}
                                className={styles.mobileLinkRow}
                              >
                                <a
                                  href={linkItem.link}
                                  className={styles.mobileNavLink}
                                >
                                  {linkItem.label}
                                </a>

                                {linkItem.badge && (
                                  <span className={styles.badge}>
                                    {linkItem.badge}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`col-xl-4 col-lg-6 col-md-6 col-sm-12 ${styles.menu_column}`}>
                <div className={styles.video}>
                  <img src="/assets/images/video.jpg" alt="" />
                  <i className="fa-solid fa-circle-play"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Modal Start */}
      {isSignIn && (
        <div
          className={`is-logged ${isSignIn ? "active" : ""}`}
          onClick={() => setIsSignIn(false)}
        >
          <div className="inn" onClick={(e) => e.stopPropagation()}>
            <div className="row align-items-center">
              {/* LEFT IMAGE */}

              <div className="col-lg-6 col-sm-12">
                <div className="img">
                  <img src="/assets/images/log-img.png" alt="Sign Up" />
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
                          placeholder="First Name"
                          value={signUpFirstName}
                          onChange={(e) => {
                            setSignUpFirstName(e.target.value);

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
                          placeholder="Last Name"
                          value={signUpLastName}
                          onChange={(e) => {
                            setSignUpLastName(e.target.value);

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
                            disabled={signUpOtpRequested}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");

                              setSignUpMobile(value);

                              setSignUpError("");
                            }}
                          />

                          <button
                            type="button"
                            id="otpButton"
                            onClick={
                              signUpOtpRequested
                                ? handleChangeSignUpMobile
                                : handleSignUpGetOtp
                            }
                            disabled={
                              signUpLoading ||
                              (!signUpOtpRequested &&
                                signUpMobile.length !== 10)
                            }
                          >
                            {signUpLoading
                              ? "Sending..."
                              : signUpOtpRequested
                                ? "Change Number"
                                : "Get OTP"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* OTP SECTION */}

                    {signUpOtpRequested && (
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <h5>Enter Your OTP</h5>

                        <div className="digit-group">
                          {signUpOtp.map((digit, index) => (
                            <input
                              key={index}
                              type="tel"
                              id={`signup-digit-${index + 1}`}
                              name={`signup-digit-${index + 1}`}
                              value={digit}
                              maxLength={1}
                              required
                              onChange={(e) =>
                                handleSignUpOtpChange(index, e.target.value)
                              }
                            />
                          ))}
                        </div>

                        <div className="otpRequested">
                          {signUpTimer > 0 ? (
                            <p>
                              Time Remaining: <span>{signUpTimer} sec</span>
                            </p>
                          ) : (
                            <p>OTP expired.</p>
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
                            setSignUpEmail(e.target.value);

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
                          checked={signUpTerms}
                          onChange={(e) => setSignUpTerms(e.target.checked)}
                        />

                        <span className="checkmark" />

                        <span className="sp-lbl">
                          I agree to the{" "}
                          <a href="#" onClick={(e) => e.preventDefault()}>
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
                    onClick={handleRegister}
                    disabled={signUpLoading}
                  >
                    {signUpLoading ? "Registering..." : "Register"}
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
          <div className="inn" onClick={(e) => e.stopPropagation()}>
            <div className="row align-items-center">
              {/* LEFT IMAGE */}

              <div className="col-lg-6 col-sm-12">
                <div className="img">
                  <img src="/assets/images/log-img.png" alt="Login" />
                </div>
              </div>

              {/* RIGHT LOGIN */}

              <div className="col-lg-6 col-sm-12">
                <div className="text">
                  <h3>Sign in to your account</h3>

                  <p>
                    View your reports and upcoming health checkups at one place.
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
                          disabled={loading || otpRequested}
                          onChange={(event) => {
                            const value = event.target.value.replace(/\D/g, "");

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
                        <h5>Enter Your OTP</h5>

                        <div className="digit-group">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              type="tel"
                              id={`digit-${index + 1}`}
                              name={`digit-${index + 1}`}
                              value={digit}
                              maxLength={1}
                              required
                              onChange={(event) =>
                                handleOtpChange(index, event.target.value)
                              }
                            />
                          ))}
                        </div>

                        <div className="otpRequested">
                          {timer > 0 ? (
                            <p>
                              Time Remaining: <span>{timer} sec</span>
                            </p>
                          ) : (
                            <p>OTP expired. You can request another OTP.</p>
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
                      onClick={handleGetLoginOtp}
                      disabled={loading || mobileNumber.length !== 10}
                    >
                      {loading ? "Sending OTP..." : "Get OTP"}
                    </button>
                  )}

                  {/* OTP RECEIVED */}

                  {loginSession && (
                    <span>Welcome, {loginSession.user.first_name}</span>
                  )}

                  {otpRequested && (
                    <button
                      type="button"
                      className="cmn_btn w-100"
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.some((digit) => digit === "")}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
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
        <div
          className={`location-modal-backdrop ${isLocation ? "active" : ""}`}
          onClick={() => setIsLocation(false)}
        >
          <div className="inn" onClick={(e) => e.stopPropagation()}>
            <div className="search-wrap position-relative">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search Your City"
                className="form-control"
              />
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
        <div
          className={`modal_backdrop ${isSearch ? "active" : ""}`}
          onClick={() => setIsSearch(false)}
        >
          <div
            className="lab-search-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lab-search-field">
              <i className="fa-solid fa-magnifying-glass lab-search-symbol"></i>
              <input
                type="text"
                placeholder="Search for Tests, Health Check-ups"
                name="labSearch"
                className="form-control"
              />
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
                      <div className="lab-result-name">CBC</div>
                      <div className="lab-result-category">Tests</div>
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
                      <div className="lab-result-category">Package</div>
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
                    <div className="lab-result-category">Tests</div>
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
                    <div className="lab-result-category">Tests</div>
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
                    <div className="lab-result-category">Package</div>
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
