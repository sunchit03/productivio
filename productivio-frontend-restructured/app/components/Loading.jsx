import React from 'react';
import './Loading.css';

const Loading = () => (
  <div className="loading-wrapper" data-testid="loading">
    <div className="loading-container">
      <div className="loading-circle"></div>
      <img
        src="/assets/loading-icon.png"
        alt="Loading"
        className="loading-image"
      />
    </div>
  </div>
);

export default Loading;

