"use client";
import React, { useRef, useState } from "react";
import "./page.css";

type Status = "Cart Ready" | "Completed" | "Under Review";
interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
    status: Status;
    daysAgo: string;
    symptoms: string;
    tests: number;
}

const patients: Patient[] = [
    {
        id: 1,
        name: "Tarun Sana",
        age: 33,
        gender: "Male",
        status: "Cart Ready",
        daysAgo: "2 Days Ago",
        symptoms: "Fever And Weakness, Headache",
        tests: 3,
    },
    {
        id: 2,
        name: "Tarun Sana",
        age: 33,
        gender: "Female",
        status: "Completed",
        daysAgo: "2 Days Ago",
        symptoms: "Fever And Weakness, Headache",
        tests: 3,
    },
    {
        id: 3,
        name: "Tarun Sana",
        age: 33,
        gender: "Male",
        status: "Under Review",
        daysAgo: "2 Days Ago",
        symptoms: "Fever And Weakness, Headache",
        tests: 3,
    },
    {
        id: 4,
        name: "Tarun Sana",
        age: 33,
        gender: "Male",
        status: "Cart Ready",
        daysAgo: "2 Days Ago",
        symptoms: "Fever And Weakness, Headache",
        tests: 3,
    },
];

const filters = [
    { label: "All", count: 4 },
    { label: "Under Review", count: 1 },
    { label: "Cart Ready", count: 2 },
    { label: "Completed", count: 1 },
];

const Page = () => {
    const [activeTab, setActiveTab] = useState("upload");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle File Upload
    const handleFiles = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;
        const newFiles = Array.from(selectedFiles).filter(
            (file) =>
                ["image/jpeg", "image/png", "application/pdf"].includes(
                    file.type
                ) &&
                file.size <= 10 * 1024 * 1024
        );
        setFiles((prev) => [...prev, ...newFiles]);
    };

    // Remove Uploaded File
    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // for prescription
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredPatients =
        activeFilter === "All"
            ? patients
            : patients.filter(
                (patient) => patient.status === activeFilter
            );

    const getStatusClass = (status: Status) => {
        switch (status) {
            case "Cart Ready":
                return "cart-ready";
            case "Completed":
                return "completed";
            case "Under Review":
                return "under-review";
            default:
                return "";
        }
    };
    // End prescription

    const [showDetails, setShowDetails] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const handleViewDetails = (patient: Patient) => {
        setSelectedPatient(patient);
        setShowDetails(true);
    };

    const closeDetailsModal = () => {
        setShowDetails(false);
        setSelectedPatient(null);
    };

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "lab",
            name: "Lab Team",
            text: "Hi! We Reviewed The Prescription For Tarun Sana. Our Pathologist Recommends The Tests Below. You Can Add Individual Tests Or The Full Bundle (10% Off). Reply Here If You Have Any Questions.",
        },
        {
            id: 2,
            sender: "user",
            name: "Tarun",
            text: "Hello, I Have A Prescription From My Doctor For Some Blood Tests. I'm Sending It Here For Your Reference.",
        },
    ]);

    const handleSend = () => {
        if (!message.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                sender: "user",
                name: "Tarun",
                text: message,
            },
        ]);

        setMessage("");
    };

    return (
        <div className="prescription-page">
            <div className="container">
                <div className="bred-camp">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Lab Test</li>
                        </ol>
                    </nav>
                </div>

                <div className="in-banner">
                    <div className="inn">
                        <img src="/assets/images/presbanner.jpg" alt="" />
                        <div className="text-block">
                            <h1><span>Upload Prescription to </span>Book Lab Tests</h1>
                            <p>Upload your doctor’s prescription to book the recommended tests</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="pres-tabs">
                    <button
                        className={activeTab === "upload" ? "active" : ""}
                        onClick={() => setActiveTab("upload")}
                    >
                        Upload Prescription
                    </button>

                    <button
                        className={activeTab === "my" ? "active" : ""}
                        onClick={() => setActiveTab("my")}
                    >
                        My Prescription
                    </button>
                </div>

                {/*==== My Prescription Tab ====*/}
                {activeTab === "upload" ? (
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="box">
                                <div className="top-head">
                                    <div className="left">
                                        <img src="/assets/images/pres-icon.svg" alt="" />
                                        <div className="text-block">
                                            <h4>Select Patient</h4>
                                            <p>Choose the patient for whom the tests are being booked</p>
                                        </div>
                                    </div>
                                    <button className="exp-btn">
                                        Add Patients <img src="/assets/images/pres-icon2.svg" alt="" />
                                    </button>
                                </div>
                                <div className="no-patient">
                                    <p>No patients yet. <span>Add Family Member</span></p>
                                </div>
                            </div>

                            <div className="box">
                                <div className="top-head">
                                    <div className="left">
                                        <img src="/assets/images/pres-icon3.svg" alt="" />
                                        <div className="text-block">
                                            <h4>More Details</h4>
                                            <p>Enter the required details to complete your test booking</p>
                                        </div>
                                    </div>
                                </div>
                                <label>Symptoms or Concern <span className="is-lbl-text">(help our pathologists pick tests)</span></label>
                                <textarea placeholder="e.g. Mild headache, Low-grade fever, Runny nose, Sore throat" className="form-control"></textarea>
                            </div>

                            <div className="box">
                                <div className="top-head">
                                    <div className="left">
                                        <img src="/assets/images/pres-icon4.svg" alt="" />
                                        <div className="text-block">
                                            <h4>Why Happens Next</h4>
                                            <p>Pathology reference ranges vary based on patient age & gender.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="step-bar">
                                    <div className="step-box">
                                        <div className="icon">
                                            <img src="/assets/images/" alt="img" />
                                        </div>
                                        <h6>Upload Prescription</h6>
                                        <p>Patient uploads the prescription through the lab’s website </p>
                                    </div>
                                    <div className="step-box">
                                        <div className="icon">
                                            <img src="/assets/images/" alt="img" />
                                        </div>
                                        <h6>Pathologist Review</h6>
                                        <p>The prescription is forwarded to the concerned pathologist</p>
                                    </div>
                                    <div className="step-box">
                                        <div className="icon">
                                            <img src="/assets/images/" alt="img" />
                                        </div>
                                        <h6>Sample Collection</h6>
                                        <p>The patient provides the required sample at the lab </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="upload-box">
                                <div className="top-head">
                                    <div className="left">
                                        <img src="/assets/images/pres-icon5.svg" alt="" />
                                        <div className="text-block">
                                            <h4>Attach Prescription Document</h4>
                                            <p>Upload a clear image or PDF of your prescription</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div
                                    className={`upload-area ${isDragging ? "dragging" : ""
                                        }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        handleFiles(e.dataTransfer.files);
                                    }}
                                >
                                    <div className="upload-file-icon">
                                        <img src="/assets/images/pres-icon6.svg" alt="" />
                                    </div>
                                    <h6>Drop Prescription Here Or Click To Browse</h6>
                                    <p>Supports JPEG, PNG, PDF (Up To 10MB Per File)</p>
                                    <div className="upload-features">
                                        <span><i className="fa-solid fa-check"></i> Handwritten Doctor Rx</span>
                                        <span><i className="fa-solid fa-check"></i> E-Prescriptions</span>
                                        <span><i className="fa-solid fa-check"></i> Discharge Summary</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="sec_btn border-0"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        Browse File
                                    </button>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        multiple
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => {
                                            handleFiles(e.target.files);
                                            e.target.value = "";
                                        }}
                                    />
                                </div>

                                {/* Uploaded Files */}
                                <div className="uploaded-files">
                                    {files.map((file, index) => (
                                        <div
                                            className="uploaded-file"
                                            key={`${file.name}-${index}`}
                                        >
                                            <div className="left">
                                                <div className="file-type-icon">
                                                    <img
                                                        src={
                                                            file.type === "application/pdf"
                                                                ? "/assets/images/pres-icon9.svg"
                                                                : "/assets/images/pres-icon8.svg"
                                                        }
                                                        alt={file.type === "application/pdf" ? "PDF" : "Image"}
                                                    />
                                                </div>
                                                <div className="file-info">
                                                    <h6>{file.name}</h6>
                                                    <p>
                                                        {(
                                                            file.size /
                                                            (1024 * 1024)
                                                        ).toFixed(2)}{" "}
                                                        MB · Ready For Pathologist Review
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="remove-file"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                                aria-label={`Remove ${file.name}`}
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="upload-footer">
                                    <div className="d-flex gap-2 encrypted ">
                                        <img src="/assets/images/pres-icon7.svg" alt="" />
                                        <p>Your Data Is Encrypted And Visible Only To Our Pathologists.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="cmn_btn"
                                        disabled={files.length === 0}
                                    >
                                        Submit for Review
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                ) : (
                    /*==== My Prescription Tab ====*/
                    <div className="prescription-card my-prescription-card">
                        <div className="select-pnls">
                            <div className="left-block">
                                <input type="text" placeholder="Search Tests &amp; Packages" className="form-control" />
                                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                <button>
                                    <i className="fa-solid fa-microphone"></i>
                                </button>
                            </div>
                            <div className="select-pnl">
                                <select className="form-control form-select">
                                    <option value="mostpopular" selected>Most Popular</option>
                                    <option value="organ">Organ Wise</option>
                                    <option value="condition">Condition Wise</option>
                                    <option value="department">Department Wise</option>
                                </select>
                            </div>
                        </div>

                        <div className="patient-listing">

                            {/* Filter Tabs */}
                            <div className="patient-filter">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.label}
                                        type="button"
                                        className={`filter-btn ${activeFilter === filter.label ? "active" : ""
                                            }`}
                                        onClick={() => setActiveFilter(filter.label)}
                                    >
                                        {filter.label} ({filter.count})
                                    </button>
                                ))}
                            </div>

                            {/* Patient Cards */}
                            <div className="row g-3">

                                {filteredPatients.map((patient) => (
                                    <div className="col-12 col-md-6 col-lg-4" key={patient.id}>

                                        <div className="patient-card">
                                            <div className="patient-card-top">
                                                <div className="patient-status-row">
                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            patient.status
                                                        )}`}
                                                    >
                                                        <span className="status-symbol">
                                                            {patient.status === "Cart Ready" ? (
                                                                <i className="fa-solid fa-cart-shopping"></i>
                                                            ) : patient.status === "Completed" ? (
                                                                <i className="fa-solid fa-check"></i>
                                                            ) : (
                                                                <i className="fa-solid fa-clock"></i>
                                                            )}
                                                        </span>
                                                        {patient.status}
                                                    </span>
                                                    <span className="patient-date">
                                                        {patient.daysAgo}
                                                    </span>
                                                </div>

                                                {/* Patient Details */}
                                                <div className="patient-info-row">
                                                    <div className="patient-profile">
                                                        <div className="patient-avatar">
                                                            <img
                                                                src="/assets/images/user2.png"
                                                                alt={patient.name}
                                                            />
                                                        </div>

                                                        <div className="patient-info">
                                                            <h4>{patient.name}</h4>

                                                            <p>
                                                                <span className="gender-icon">
                                                                    {patient.gender === "Female" ? (
                                                                        <i className="fa-solid fa-venus"></i>
                                                                    ) : (
                                                                        <i className="fa-solid fa-mars"></i>
                                                                    )}
                                                                </span>
                                                                {patient.age} Y <span>•</span> {patient.gender}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="sec_btn border-0"
                                                        onClick={() => handleViewDetails(patient)}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Card Footer */}
                                            <div className="patient-card-footer">
                                                <div className="patient-symptoms">
                                                    <span className="footer-icon"><i className="fa-solid fa-heart"></i></span>
                                                    <span>“{patient.symptoms}”</span>
                                                </div>
                                                <div className="patient-tests">
                                                    <span className="footer-icon"><i className="fa-solid fa-vial"></i></span>
                                                    <span>1 · {patient.tests} Tests Suggested</span>
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                ))}

                                {filteredPatients.length === 0 && (
                                    <div className="col-12">
                                        <div className="no-patients">
                                            No patients found.
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Block Start */}
                <div
                    className={`cmn-backdrop ${showDetails ? "active" : ""}`}
                    onClick={closeDetailsModal}
                >
                    <div className="inn is-wide" onClick={(e) => e.stopPropagation()}>
                        {/* <div className="header">
                            <div>
                                <h4>Add Address</h4>
                                <p>Enter your sample collection address.</p>
                            </div>
                            <button type="button" className="closeBtn" aria-label="Close address modal">
                                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                            </button>
                        </div> */}
                        <div className="content-areas">
                            <div className="pt-banner">
                                <div className="text-block">
                                    <div className="patient-name d-flex align-items-start gap-2">
                                        <img src="/assets/images/rx-black.svg" alt="" />
                                        <h2>John Doe <span className="patient-age">Male, 26 yrs</span></h2>
                                    </div>
                                    <p>Uploaded On: 6 Oct 2026, 5:27 pm</p>
                                    <div className="symptoms-list">
                                        <span>Headaches</span>
                                        <span>Dizziness</span>
                                        <span>Vertigo</span>
                                        <span>Confusion</span>
                                        <span>Numbness...</span>
                                    </div>
                                </div>

                                <div className="img-block">
                                    <img src="/assets/images/patient-banner.png" alt="Patient" />
                                </div>

                            </div>

                            <div className="pt-progress">
                                <div className="progress-step completed">
                                    <div className="step-icon">
                                        <img src="/assets/images/lab-up1.svg" alt="" />
                                    </div>
                                    <h6>Uploaded</h6>
                                </div>
                                <div className="progress-step completed">
                                    <div className="step-icon">
                                        <img src="/assets/images/lab-up2.svg" alt="" />
                                    </div>
                                    <h6>Lab Reviewed</h6>
                                </div>
                                <div className="progress-step active">
                                    <div className="step-icon">
                                        <img src="/assets/images/lab-up3.svg" alt="" />
                                    </div>
                                    <h6>Cart Ready</h6>
                                </div>
                                <div className="progress-step">
                                    <div className="step-icon">
                                        <img src="/assets/images/lab-up4.svg" alt="" />
                                    </div>
                                    <h6>Completed</h6>
                                </div>
                            </div>

                            <div className="pres-review">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="attach-card">
                                            <div className="card-head">
                                                <i className="fa-solid fa-paperclip"></i>
                                                <h4>Attach Prescription Document</h4>
                                            </div>

                                            <div className="document-list">
                                                <div className="document-item">
                                                    <div className="document-info">
                                                        <div className="icon">
                                                            <i className="fa-solid fa-image"></i>
                                                        </div>
                                                        <div className="text">
                                                            <h6>Prescription.png <span>1.36MB</span></h6>
                                                        </div>
                                                    </div>
                                                    <div className="document-preview">
                                                        <img
                                                            src="/assets/images/prescription.png"
                                                            alt="Prescription document"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="document-item">
                                                    <div className="document-info">
                                                        <div className="icon">
                                                            <i className="fa-solid fa-file-pdf"></i>
                                                        </div>
                                                        <div className="text">
                                                            <h6>Prescription.png <span>1.36MB</span></h6>
                                                        </div>
                                                    </div>
                                                    <div className="document-preview">
                                                        <img
                                                            src="/assets/images/prescription.png"
                                                            alt="Prescription document"
                                                        />
                                                    </div>
                                                </div>

                                            </div>




                                        </div>

                                        <div className="review-card chat-card">
                                            <div className="card-head">
                                                <i className="fa-regular fa-comment-dots"></i>
                                                <h4>Conversation with Lab team</h4>
                                            </div>

                                            <div className="chat-messages">

                                                {messages.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={`chat-message ${item.sender === "user"
                                                            ? "user-message"
                                                            : "lab-message"
                                                            }`}
                                                    >

                                                        {item.sender === "lab" && (
                                                            <div className="lab-avatar">
                                                                NH
                                                            </div>
                                                        )}

                                                        <div className="message-content">
                                                            <h6>{item.name}</h6>
                                                            <p>{item.text}</p>
                                                        </div>

                                                        {item.sender === "user" && (
                                                            <div className="user-avatar">
                                                                <img
                                                                    src="/assets/images/user2.png"
                                                                    alt="User"
                                                                />
                                                            </div>
                                                        )}

                                                    </div>
                                                ))}

                                            </div>

                                            {/* Message Input */}
                                            <div className="chat-input-area">
                                                <textarea
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Message the lab team (e.g. 'Can we skip the Vitamin D test?')"
                                                    className="form-control"
                                                />
                                                <div className="text-end mt-3">
                                                    <button
                                                        type="button"
                                                        className="sec_btn border-0"
                                                        onClick={handleSend}
                                                    >
                                                        Send
                                                        <i className="fa-solid fa-paper-plane"></i>
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="sugg-card">
                                            <div className="inn-wrap">
                                                <div className="card-head">
                                                    <i className="fa-solid fa-cart-shopping"></i>
                                                    <h4>Suggested Investigation</h4>
                                                </div>
                                                <div className="sugglist">
                                                    <div className="sug-box">
                                                        <div className="inv-heading">
                                                            <div className="inv-icon">
                                                                <img src="/assets/images/heart.png" alt="" />
                                                            </div>
                                                            <h5>Complete Blood Count (CBC)</h5>
                                                        </div>
                                                        <div className="btm-pnl">
                                                            <div className="bt-box">
                                                                <div className="icon">
                                                                    <img src="/assets/images/report.svg" alt="" />
                                                                    <h6>Reports in</h6>
                                                                </div>
                                                                <div className="text-block">
                                                                    <h6>Same Day</h6>
                                                                </div>
                                                            </div>
                                                            <div className="bt-box">
                                                                <div className="icon">
                                                                    <img src="/assets/images/ava.svg" alt="" />
                                                                    <h6>Sample Type</h6>
                                                                </div>
                                                                <div className="text-block">
                                                                    <h6>Serum</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="inv-price">
                                                            <div className="price-content">
                                                                <h4><del>₹911</del> ₹ 2,599</h4>
                                                            </div>
                                                            <span className="is-discount">10% Off</span>
                                                        </div>
                                                    </div>
                                                    <div className="sug-box">
                                                        <div className="inv-heading">
                                                            <div className="inv-icon">
                                                                <img src="/assets/images/heart.png" alt="" />
                                                            </div>
                                                            <h5>Complete Blood Count (CBC)</h5>
                                                        </div>
                                                        <div className="btm-pnl">
                                                            <div className="bt-box">
                                                                <div className="icon">
                                                                    <img src="/assets/images/report.svg" alt="" />
                                                                    <h6>Reports in</h6>
                                                                </div>
                                                                <div className="text-block">
                                                                    <h6>Same Day</h6>
                                                                </div>
                                                            </div>
                                                            <div className="bt-box">
                                                                <div className="icon">
                                                                    <img src="/assets/images/ava.svg" alt="" />
                                                                    <h6>Sample Type</h6>
                                                                </div>
                                                                <div className="text-block">
                                                                    <h6>Serum</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="inv-price">
                                                            <div className="price-content">
                                                                <h4><del>₹911</del> ₹ 2,599</h4>
                                                            </div>
                                                            <span className="is-discount">10% Off</span>
                                                        </div>
                                                    </div>
                                                    <div className="sug-box">
                                                        <div className="inv-heading">
                                                            <div className="inv-icon">
                                                                <img src="/assets/images/heart.png" alt="" />
                                                            </div>
                                                            <h5>Complete Blood Count (CBC)</h5>
                                                        </div>
                                                        <div className="btm-pnl">
                                                            <div className="bt-box">
                                                                <div className="icon">
                                                                    <img src="/assets/images/report.svg" alt="" />
                                                                    <h6>Reports in</h6>
                                                                </div>
                                                                <div className="text-block">
                                                                    <h6>Same Day</h6>
                                                                </div>
                                                            </div>
                                                            <div className="bt-box">
                                                                <div className="icon">
                                                                    <img src="/assets/images/ava.svg" alt="" />
                                                                    <h6>Sample Type</h6>
                                                                </div>
                                                                <div className="text-block">
                                                                    <h6>Serum</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="inv-price">
                                                            <div className="price-content">
                                                                <h4><del>₹911</del> ₹ 2,599</h4>
                                                            </div>
                                                            <span className="is-discount">10% Off</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-end mt-3">
                                                    <button className="cmn_btn">Add all Investigstion</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
                {/* Modal Block End */}
            </div>
        </div>
    );
};

export default Page;

