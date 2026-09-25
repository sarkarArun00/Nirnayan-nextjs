import React from 'react';
import styles from './Faq.module.css';

function Faq() {
  return (
    <div className={styles.faq_section}>
      <div className="container">
        <div className={`top-title ${styles.top_title}`}>
          <div className="left-pnl">
            <h2>Solve Your Queries Here</h2>
            <p>Have any questions? We're here to assist you</p>
          </div>
          <button className="expand-btn">
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </span>
            <span className="btn-text">View More</span>
          </button>
        </div>

        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                aria-expanded="true" aria-controls="collapseOne">
                How Can I Find Information On Tests And Packages?
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne"
              data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                <p>
                  You need to log in to <strong>www.nirnayanhealthcare.com</strong> and click on the option of “Patient” and you will get the information about that and also you can filter test and packages according to you.
                </p>
                <a href="#">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                How Can I Find Information On Tests And Packages?
              </button>

            </h2>

            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
              data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                <p>
                  You can find all test and package information from the
                  Patient section of our website.
                </p>
                <a href="#">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                How Can I Find Information On Tests And Packages?
              </button>
            </h2>

            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
              data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                <p>
                  You can contact our support team for more information.
                </p>
                <a href="#">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingFour">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                How Can I Find Information On Tests And Packages?
              </button>
            </h2>

            <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour"
              data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                <p>
                  Please contact us for additional information.
                </p>
                <a href="#">Contact Us</a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.questaions}>
          <div className={styles.text_block}>
            <h2>Still Have Question</h2>
            <p>Can’t find the answer you’re looking for? Please chat to our friendly team</p>
          </div>
          <button className="cmn_btn">Get In Touch</button>
          <img src="/assets/images/faq-icon.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Faq