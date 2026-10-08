import React from 'react'
// import './TestDetail.css'
function TestDetail() {
    return (
        <>
            <div className="sticky-bar">
                <div className="container">
                    <div className="top-wrap">
                        <div className="lt-side"></div>
                        <div className="lt-side">
                            <div className="price">
                                <span>₹299 <del>₹446</del></span>
                                <span className='off'>25% off</span>
                            </div>
                            <button className='cmn_btn'>Add to Cart</button>
                        </div>
                    </div>
                    <ul>
                        <li>OverView</li>
                        <li>City Wise Pricing</li>
                        <li>Related Test</li>
                        <li>Related Package</li>
                        <li>Blog</li>
                        <li>Feedback</li>
                    </ul>
                </div>
            </div>








        </>
    )
}

export default TestDetail