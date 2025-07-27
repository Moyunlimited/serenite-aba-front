import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutRBT from "./pages/AboutRBT";
import StudyGuide from "./pages/StudyGuide";
import Quizzes from "./pages/Quizzes";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Services from "./pages/Services";
import AdminUserApproval from "./pages/AdminUserApproval";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <Navbar />
        <main className="flex-fill">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutRBT />} />
            <Route path="/guide" element={<StudyGuide />} />
            <Route path="/quiz" element={<Quizzes />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/approve" element={<AdminUserApproval />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
