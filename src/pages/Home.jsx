import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <div
        className="hero-section d-flex align-items-center text-white text-center"
        style={{
          minHeight: "100vh",
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/class.png') center/cover no-repeat`,
        }}
      >
        <div className="container px-3">
          <h1 className="display-5 fw-bold mb-3">
            Serenité ABA: Empowering the Future of Behavior Therapy
          </h1>
          <p className="lead mb-4">
            Support, study guides, and prep to become an RBT.
          </p>
          <Link
            to={user ? "/guide" : "/signup"}
            className="btn btn-light btn-lg"
          >
            {user ? "Start Studying" : "Get Started"}
          </Link>
        </div>
      </div>

      {/* Services Section */}
      <div
        style={{
          background: "linear-gradient(to right, #f9f9f9, #e8f0fa)",
          padding: "60px 0",
        }}
      >
        <div className="container">
          <h2 className="mb-4 text-center fw-bold text-primary">Services Offered</h2>
          <p className="mb-5 text-center text-secondary fs-5">
            Choose a plan that fits your learning needs.
          </p>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            {/* Free */}
            <div className="col">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title text-primary">Free Consultation</h5>
                  <p className="card-text text-muted">
                    15-minute phone call to discuss your goals and how we can help.
                  </p>
                  <Link to="/services" className="btn btn-outline-primary mt-auto">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Basic */}
            <div className="col">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title text-primary">Basic Service - $300</h5>
                  <p className="card-text text-muted">
                    6 sessions via Zoom with a personalized study plan and exam tips.
                  </p>
                  <Link to="/services" className="btn btn-outline-primary mt-auto">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Advanced */}
            <div className="col">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title text-primary">Advanced Service - $500</h5>
                  <p className="card-text text-muted">
                    Full support: mock exam, competency prep, job guidance, resume & cover letter help.
                  </p>
                  <Link to="/services" className="btn btn-outline-primary mt-auto">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Callout */}
          <div className="text-center mt-5">
            <p className="text-muted">
              Not sure which one to choose?{" "}
              <Link to="/contact" className="fw-semibold text-primary">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
