
"use client";

import React, { useRef, useState } from "react";
import "./page.css";

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

    return (
        <div className="prescription-page container-fluid">

            {/* Tabs */}
            <div className="prescription-tabs">
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

            {activeTab === "upload" ? (

                <div className="row g-4">

                    {/* LEFT COLUMN */}
                    <div className="col-lg-6">

                        {/* Select Patient */}
                        <div className="prescription-card patient-card">

                            <div className="card-heading">
                                <div className="heading-icon">♟</div>

                                <div className="heading-content">
                                    <h5>Select Patient</h5>
                                    <p>
                                        Choose the patient for whom the tests are
                                        being booked
                                    </p>
                                </div>

                                <button className="add-patient-btn">
                                    Add Patients <span>♙</span>
                                </button>
                            </div>

                            <div className="empty-patient">
                                No Patients Yet.{" "}
                                <strong>Add Family Member</strong>
                            </div>

                        </div>

                        {/* More Details */}
                        <div className="prescription-card details-card">

                            <div className="card-heading">
                                <div className="heading-icon">▤</div>

                                <div className="heading-content">
                                    <h5>More Details</h5>
                                    <p>
                                        Enter the required details to complete
                                        your test booking
                                    </p>
                                </div>
                            </div>

                            <label className="form-label">
                                Symptoms Or Concern
                                <span>
                                    {" "}(help our pathologists pick tests)
                                </span>
                            </label>

                            <textarea
                                className="form-control"
                                placeholder="e.g. Mild headache, Low-grade fever, Runny nose, Sore throat"
                            />

                        </div>

                        {/* Why Happens Next */}
                        <div className="prescription-card workflow-card">

                            <div className="card-heading">
                                <div className="heading-icon">♧</div>

                                <div className="heading-content">
                                    <h5>Why Happens Next</h5>
                                    <p>
                                        Pathology Reference Ranges Vary Based
                                        On Patient Age & Gender.
                                    </p>
                                </div>
                            </div>

                            <div className="workflow-steps">

                                {/* Step 1 */}
                                <div className="workflow-step">
                                    <div className="step-icon">
                                        <span>▤</span>
                                        <b>1</b>
                                    </div>

                                    <h6>Upload Prescription</h6>

                                    <p>
                                        Patient Uploads The Prescription
                                        Through The Lab’s Website
                                    </p>
                                </div>

                                <div className="step-arrow">→</div>

                                {/* Step 2 */}
                                <div className="workflow-step">
                                    <div className="step-icon">
                                        <span>▤</span>
                                        <b>2</b>
                                    </div>

                                    <h6>Pathologist Review</h6>

                                    <p>
                                        The Prescription Is Forwarded To
                                        The Concerned Pathologist
                                    </p>
                                </div>

                                <div className="step-arrow">→</div>

                                {/* Step 3 */}
                                <div className="workflow-step">
                                    <div className="step-icon">
                                        <span>▤</span>
                                        <b>3</b>
                                    </div>

                                    <h6>Sample Collection</h6>

                                    <p>
                                        The Patient Provides The Required
                                        Sample At The Lab
                                    </p>
                                </div>

                            </div>

                            <div className="workflow-dots">
                                <span></span>
                                <span></span>
                                <span className="selected"></span>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-lg-6">

                        <div className="prescription-card upload-card">

                            <div className="card-heading">
                                <div className="heading-icon">▣</div>

                                <div className="heading-content">
                                    <h5>Attach Prescription Document</h5>
                                    <p>
                                        Upload a clear image or PDF of your
                                        prescription
                                    </p>
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
                                    📄
                                </div>

                                <h6>
                                    Drop Prescription Here Or Click To Browse
                                </h6>

                                <p>
                                    Supports JPEG, PNG, PDF (Up To 10MB Per File)
                                </p>

                                <div className="upload-features">
                                    <span>✓ Handwritten Doctor Rx</span>
                                    <span>✓ E-Prescriptions</span>
                                    <span>✓ Discharge Summary</span>
                                </div>

                                <button
                                    type="button"
                                    className="browse-btn"
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

                                        <div className="file-type-icon">
                                            {file.type === "application/pdf"
                                                ? "PDF"
                                                : "IMG"}
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

                                        <button
                                            type="button"
                                            className="remove-file"
                                            onClick={() =>
                                                removeFile(index)
                                            }
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            ×
                                        </button>

                                    </div>

                                ))}

                            </div>

                            {/* Footer */}
                            <div className="upload-footer">

                                <p>
                                    <span>♧</span>{" "}
                                    Your Data Is Encrypted And Visible Only
                                    To Our Pathologists.
                                </p>

                                <button
                                    type="button"
                                    className="submit-review-btn"
                                    disabled={files.length === 0}
                                >
                                    Submit for Review
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            ) : (

                /* My Prescription Tab */
                <div className="prescription-card my-prescription-card">
                    <h5>My Prescription</h5>
                    <p>
                        Your uploaded prescriptions will appear here.
                    </p>
                </div>

            )}

        </div>
    );
};

export default Page;
