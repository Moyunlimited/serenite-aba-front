import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth(); // Get user info

  return (
    <>
      {/* Hero Section */}
      <div
        className="hero-section d-flex align-items-center text-white"
        style={{
          height: "100vh",
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/class.png') center/cover no-repeat`,
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 fw-bold">
            Serenite ABA Empowering the future of behavior therapy
          </h1>
          <p className="lead">
            Support, study guides, and prep to become an RBT
          </p>

          <Link
            to={user ? "/guide" : "/signup"}
            className="btn btn-light btn-lg mt-3"
          >
            {user ? "Start Studying" : "Get Started"}
          </Link>
        </div>
      </div>

      {/* Services Section with Background */}
      <div
        style={{
          background: "linear-gradient(to right, #f9f9f9, #e8f0fa)",
          padding: "60px 0",
        }}
      >
        <div className="container">
          <h2 className="mb-4 text-center">Services Offered</h2>
          <p className="mb-5 text-center">
            Choose a plan that fits your learning needs.
          </p>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title">Free Consultation</h5>
                  <p className="card-text">
                   15-minute phone call to discuss your goals and how we can help.
                  </p>
                  <Link to="/services" className="btn btn-outline-primary w-100">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title">Basic Service - $300</h5>
                  <p className="card-text">
                    6 sessions via Zoom with a personalized study plan and exam tips.
                  </p>
                  <Link to="/services" className="btn btn-outline-primary w-100">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title">Advanced Service - $500</h5>
                  <p className="card-text">
                    Full support: mock exam, competency prep, job guidance, resume & cover letter help.
                  </p>
                  <Link to="/services" className="btn btn-outline-primary w-100">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
