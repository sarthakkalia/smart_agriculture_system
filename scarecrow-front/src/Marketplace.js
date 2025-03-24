import React from 'react';

const Marketplace = ({ goBack }) => {
  return (
    <div className="main-content">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Agricultural Marketplace</span>
          </h1>
          <p className="hero-subtitle">
            Connect directly with buyers and sellers for your farm produce
          </p>
          
          <div className="marketplace-content glass">
            <div className="marketplace-section">
              <h2>Available Listings</h2>
              <div className="listings-grid">
                <div className="listing-card">
                  <h3>Organic Wheat 🌾</h3>
                  <p>Price: $200/ton</p>
                  <p>Location: Punjab, India</p>
                  <button className="predict-btn">Contact Seller</button>
                </div>
                <div className="listing-card">
                  <h3>Fresh Vegetables 🥦</h3>
                  <p>Price: $1.50/kg</p>
                  <p>Location: Maharashtra, India</p>
                  <button className="predict-btn">Contact Seller</button>
                </div>
              </div>
            </div>
            
            <div className="marketplace-section">
              <h2>Create New Listing</h2>
              <div className="create-listing-form">
                <input type="text" placeholder="Product Name" className="neon-input" />
                <input type="number" placeholder="Price per unit" className="neon-input" />
                <textarea placeholder="Product Description" className="neon-input" />
                <button className="predict-btn">Publish Listing</button>
              </div>
            </div>
          </div>
          
          <button onClick={goBack} className="predict-btn back-btn">
            ← Back to Main
          </button>
        </div>
        <div className="hero-blur"></div>
      </section>
    </div>
  );
};

export default Marketplace;