import React, { useState, useEffect } from 'react';
import '../styles/widget.css';

const Widget = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [anomalies, setAnomalies] = useState({});
  const totalSlides = 4;

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/anomalies/all')
      .then(response => response.json())
      .then(data => setAnomalies(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const getStatusIcon = (status) => (
    status === 'Anomaly detected' ? '✖' : '✔'
  );

  return (
    <div className="slider-widget">
      <div className="slider-header">
        <h3>Instance Monitoring</h3>
        <div className="slider-controls">
          <button 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            aria-label="Previous"
          >
            &lt;
          </button>
          <button 
            onClick={nextSlide} 
            disabled={currentSlide === totalSlides - 1}
            aria-label="Next"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="slider-container">
        <div 
          className="slider-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="slide">
              <div className="instance-header">
                <h4>Instance ID {id}</h4>
                {anomalies[id]?.latest_timestamp && (
                  <span className="timestamp">
                    Last updated: {new Date(anomalies[id].latest_timestamp).toLocaleString()}
                  </span>
                )}
              </div>
              
              {anomalies[id] ? (
                <div className="instance-details">
                  <div className="status-item">
                    <span className="status-icon cpu">
                      {getStatusIcon(anomalies[id].cpu_anomaly_status)}
                    </span>
                    CPU Status: {anomalies[id].cpu_anomaly_status}
                  </div>
                  <div className="status-item">
                    <span className="status-icon network-in">
                      {getStatusIcon(anomalies[id].network_in_anomaly_status)}
                    </span>
                    Network In Status: {anomalies[id].network_in_anomaly_status}
                  </div>
                  <div className="status-item">
                    <span className="status-icon network-out">
                      {getStatusIcon(anomalies[id].network_out_anomaly_status)}
                    </span>
                    Network Out Status: {anomalies[id].network_out_anomaly_status}
                  </div>
                  <div className="cpu-usage">
                    <div className="status-item">
                      <span className="status-icon prediction">📈</span>
                       Predicted CPU Usage: {anomalies[id].avg_predicted_cpu_9_feb}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="loading">Loading data...</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="slider-dots">
        {[...Array(totalSlides)].map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Widget;