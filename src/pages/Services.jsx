import React from "react";

function Services() {
  return (
    <div
      style={{
        background: "linear-gradient(to right, #f9f9f9, #e0f7fa)",
        paddingTop: "60px",
        paddingBottom: "60px",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <h2 className="mb-4 text-center text-primary">Schedule Your Appointment</h2>
        <p className="mb-5 text-center text-secondary">
          Select from our flexible options to get the right support for your RBT journey.
        </p>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {/* Free Consultation */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title">Free Consultation</h5>
                <p className="card-text">
                  15-minute phone call to discuss your goals and how we can help.
                </p>
                <a
                  className="btn btn-outline-primary w-100"
                  href="https://calendly.com/your-free-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>

          {/* Basic Service */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title">Basic Service - $300</h5>
                <p className="card-text">
                  6 sessions via Zoom with a personalized study plan and exam tips.
                </p>
                <a
                  className="btn btn-outline-primary w-100"
                  href="https://calendly.com/your-basic-service"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>

          {/* Advanced Service */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title">Advanced Service - $500</h5>
                <p className="card-text">
                  Full support: mock exam, competency prep, job guidance, resume & cover letter help.
                </p>
                <a
                  className="btn btn-outline-primary w-100"
                  href="https://calendly.com/your-advanced-service"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
