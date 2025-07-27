import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const links = [
        { name: "About RBT", path: "/about" },
        { name: "Study Guide", path: "/guide" },
        { name: "Contact", path: "/contact" },
        { name: "Services", path: "/services" },
    ];

    const greetingName =
        user?.email?.split("@")[0]?.charAt(0).toUpperCase() +
        user?.email?.split("@")[0]?.slice(1) || "Guest";

    return (
        <nav
            className="navbar navbar-expand-lg shadow-sm py-3 fixed-top border-bottom"
            style={{
                backgroundColor: "#f7f4f0",
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            <div className="container">
                {/* Logo Only */}
                <Link
                    className="navbar-brand position-relative"
                    to="/"
                    style={{ paddingTop: "0", paddingBottom: "0", height: "60px", overflow: "visible" }}
                >
                    <img
                        src="/logo.png"
                        alt="Serenité ABA"
                        style={{
                            height: "115px", // Actual image height
                            width: "auto",
                            objectFit: "contain",
                            position: "absolute",
                            top: "-20px", // Shift upward to avoid stretching navbar
                            left: "0",
                        }}
                    />
                </Link>



                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {links.map((item, index) => (
                            <li className="nav-item" key={index}>
                                <Link
                                    className="nav-link text-dark px-3"
                                    to={item.path}
                                    style={{ fontSize: "1.05rem", fontWeight: "500" }}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}

                        {user && (
                            <li className="nav-item">
                                <Link
                                    className="nav-link text-dark px-3"
                                    to="/quiz"
                                    style={{ fontSize: "1.05rem", fontWeight: "500" }}
                                >
                                    {user.role === "admin" ? "Manage Quizzes" : "Quizzes"}
                                </Link>
                            </li>
                        )}

                        {user?.role === "admin" && (
                            <li className="nav-item">
                                <Link
                                    className="nav-link text-dark px-3"
                                    to="/approve"
                                    style={{ fontSize: "1.05rem", fontWeight: "500" }}
                                >
                                    Approve Users
                                </Link>
                            </li>
                        )}

                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span
                                        className="nav-link text-dark px-3"
                                        style={{ fontSize: "1rem" }}
                                    >
                                        Hello, <strong>{greetingName}</strong>
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link text-dark px-3"
                                        style={{ fontSize: "1rem", textDecoration: "none" }}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link text-dark px-3"
                                        to="/login"
                                        style={{ fontSize: "1.05rem", fontWeight: "500" }}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link text-dark px-3"
                                        to="/signup"
                                        style={{ fontSize: "1.05rem", fontWeight: "500" }}
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
